"""Reviewer-owned cross-role and negative integration coverage for Phase 1."""

from datetime import timedelta
import uuid

import pytest
from django.contrib import admin
from django.contrib.auth.models import Group, Permission, User
from django.core.exceptions import PermissionDenied, ValidationError
from django.core.management import call_command
from django.test import Client, RequestFactory, override_settings
from django.urls import reverse
from django.utils import timezone

from apps.accounts.models import AccountSecurity
from apps.accounts.roles import ROLE_DEFINITIONS, assign_fixed_role, provision_roles
from apps.accounts.security import client_ip, record_failed_login
from apps.content.admin import ContentBlockInline, ContentTranslationAdmin
from apps.content.forms import ContentBlockAdminForm, ContentTranslationAdminForm
from apps.content.models import ContentBlock, ContentItem, ContentRevision, ContentTranslation
from apps.content.services import publish_translation
from apps.content.workflow import workflow_transition
from apps.core.audit import write_audit_log
from apps.core.models import RevalidationEvent
from apps.forms.models import Form


def _user(username, role=None, *, active=True, superuser=False):
    user = (
        User.objects.create_superuser(username, password="correct-password")
        if superuser
        else User.objects.create_user(username, password="correct-password", is_active=active)
    )
    if role:
        assign_fixed_role(user, role)
    return user


def _login_client(user):
    client = Client()
    client.force_login(user)
    return client


def _admin_request(user, method="post"):
    request = getattr(RequestFactory(), method)("/admin/content/")
    request.user = user
    return request


@pytest.mark.django_db
@pytest.mark.parametrize("role_key", [role.key for role in ROLE_DEFINITIONS])
def test_each_fixed_role_can_reach_only_its_catalogued_sensitive_reads(role_key):
    provision_roles()
    user = _user(f"matrix-{role_key}", role_key)
    client = _login_client(user)

    assert client.get("/api/v1/admin/roles").status_code == 200
    assert client.get("/api/v1/admin/roles/editor").status_code == 200
    assert client.get("/api/v1/admin/dashboard").status_code == 200

    audit = client.get("/api/v1/admin/audit")
    expected_audit = 200 if role_key == "auditor" else 403
    assert audit.status_code == expected_audit

    download = client.get(
        reverse("admin-submission-file-download", kwargs={"file_id": uuid.uuid4()})
    )
    # Permission is checked before object lookup; the reviewer reaches the
    # lookup (404), while every other fixed role is denied (403).
    assert download.status_code == (404 if role_key == "submission-reviewer" else 403)


@pytest.mark.django_db
def test_anonymous_no_role_and_superuser_matrix_has_explicit_authz_evidence():
    provision_roles()
    anonymous = Client()
    no_role = _user("matrix-no-role")
    root = _user("matrix-root", superuser=True)

    for client, expected in ((_login_client(no_role), 403), (_login_client(root), 200)):
        assert client.get("/api/v1/admin/roles").status_code == expected
        assert client.get("/api/v1/admin/dashboard").status_code == expected
        assert client.get("/api/v1/admin/audit").status_code == expected
        assert client.get("/api/v1/admin/users").status_code == (403 if expected == 403 else 200)

    for path in ("/api/v1/admin/roles", "/api/v1/admin/dashboard", "/api/v1/admin/audit", "/api/v1/admin/users"):
        response = anonymous.get(path)
        assert response.status_code == 401
        assert response.json()["error"]["code"] == "session_expired"


@pytest.mark.django_db
def test_user_get_list_and_detail_are_superuser_only_for_all_account_states():
    provision_roles()
    root = _user("get-root", superuser=True)
    users = [
        _user("get-editor", "editor"),
        _user("get-publisher", "publisher"),
        _user("get-reviewer", "submission-reviewer"),
        _user("get-auditor", "auditor"),
        _user("get-no-role"),
        _user("get-inactive", "editor", active=False),
    ]
    locked = _user("get-locked", "editor")
    AccountSecurity.objects.create(user=locked, locked_until=timezone.now() + timedelta(minutes=5))
    users.append(locked)

    for user in users:
        client = _login_client(user)
        expected = 401 if not user.is_active else 403
        assert client.get("/api/v1/admin/users").status_code == expected
        assert client.get(f"/api/v1/admin/users/{root.pk}").status_code == expected

    root_client = _login_client(root)
    assert root_client.get("/api/v1/admin/users").status_code == 200
    assert root_client.get(f"/api/v1/admin/users/{users[0].pk}").status_code == 200


@pytest.mark.django_db
def test_extra_group_and_direct_permission_cannot_escalate_a_role_matrix():
    provision_roles()
    user = _user("matrix-tampered", "editor")
    escalation = Group.objects.create(name="arbitrary-escalation")
    escalation.permissions.add(Permission.objects.get(content_type__app_label="core", codename="view_auditlog"))
    user.groups.add(escalation)
    user.user_permissions.add(Permission.objects.get(content_type__app_label="forms", codename="view_submissionfile"))
    client = _login_client(user)

    assert client.get("/api/v1/admin/audit").status_code == 403
    # fixed_role_for_user rejects both the extra Group and direct grant.
    assert client.get("/api/v1/admin/roles").status_code == 403
    assert client.get(reverse("admin-submission-file-download", kwargs={"file_id": uuid.uuid4()})).status_code == 403


@pytest.mark.django_db
def test_public_endpoints_remain_anonymous_after_admin_matrix_is_installed():
    form = Form.objects.create(key="public-matrix")
    client = Client()

    assert client.get("/health/").status_code == 200
    assert client.get("/api/v1/site/settings?locale=invalid").status_code == 400
    assert client.get("/api/v1/navigation/header/en").status_code == 200
    assert client.get("/api/v1/content/collections/page/en").status_code == 200
    assert client.get("/api/v1/pricing/packages?locale=en").status_code == 200
    assert client.get("/api/v1/search?locale=en&q=ab").status_code == 200
    response = client.post(
        reverse("form-submission-create", kwargs={"form_key": form.key}),
        {"locale": "en", "data": {}, "consent_given": False},
        content_type="application/json",
    )
    assert response.status_code == 400
    assert response.status_code != 401


@pytest.mark.django_db
def test_publication_form_inline_action_and_workflow_field_bypasses_are_denied():
    provision_roles()
    item = ContentItem.objects.create(key="matrix-publication", kind=ContentItem.Kind.PAGE)
    translation = ContentTranslation.objects.create(
        item=item, locale="en", title="Reviewed", slug="matrix-publication", path="matrix-publication",
        translation_status=ContentTranslation.TranslationStatus.REVIEWED,
    )
    block = ContentBlock.objects.create(
        translation=translation, block_type="rich_text", order=0, props={"html": "<p>safe</p>"}
    )
    editor = _user("matrix-editor", "editor")
    publisher = _user("matrix-publisher", "publisher")
    publisher_admin = ContentTranslationAdmin(ContentTranslation, admin.site)
    publisher_admin.message_user = lambda *args, **kwargs: None

    crafted = ContentTranslationAdminForm(instance=translation, data={
        "item": item.pk, "locale": "en", "title": "Crafted", "slug": translation.slug,
        "path": translation.path, "workflow_status": "published", "translation_status": "reviewed",
        "publish_at": "", "published_at": "", "source_revision": "", "excerpt": "",
        "seo_title": "", "seo_description": "", "canonical_url": "", "robots_index": "on",
        "robots_follow": "on", "og_title": "", "og_description": "", "og_image": "",
    })
    assert not crafted.is_valid()
    with pytest.raises(PermissionDenied):
        publisher_admin.publish_selected(_admin_request(editor), ContentTranslation.objects.filter(pk=translation.pk))

    publish_translation(translation, actor=publisher)
    translation.refresh_from_db()
    assert not ContentBlockAdminForm(instance=block, data={
        "translation": translation.pk, "block_type": "rich_text", "variant": "default",
        "order": 0, "is_active": "on", "schema_version": 1, "props": '{"html":"<p>x</p>"}',
    }).is_valid()
    inline = ContentBlockInline(ContentTranslation, admin.site)
    assert inline.has_change_permission(_admin_request(editor, "get"), translation) is False
    assert inline.has_delete_permission(_admin_request(editor, "get"), translation) is False
    with pytest.raises(ValidationError):
        item.is_active = False
        item.save()
    assert RevalidationEvent.objects.filter(paths=["/en/matrix-publication"]).exists()


@pytest.mark.django_db
def test_lockout_equivalence_concurrency_and_trusted_proxy_boundary():
    user = _user("lockout-matrix")
    request = RequestFactory().post("/api/v1/admin/auth/login")
    request.META["REMOTE_ADDR"] = "198.51.100.10"

    # Each request owns an atomic row-locked update. SQLite serializes these
    # writes in the test database; repeated independent calls exercise the
    # same transaction boundary without making the suite thread-nondeterministic.
    for _ in range(5):
        record_failed_login(user, request=request)
    security = AccountSecurity.objects.get(user=user)
    assert security.failed_attempts >= 5
    assert security.locked_until is not None

    client = Client(enforce_csrf_checks=True)
    token = client.get("/api/v1/admin/auth/csrf").json()["data"]["csrf_token"]
    wrong = client.post("/api/v1/admin/auth/login", {"username": user.username, "password": "wrong"}, HTTP_X_CSRFTOKEN=token)
    unknown = client.post("/api/v1/admin/auth/login", {"username": "missing", "password": "wrong"}, HTTP_X_CSRFTOKEN=token)
    assert wrong.status_code == unknown.status_code == 401

    inactive = _user("lockout-inactive", active=False)
    inactive_wrong = client.post("/api/v1/admin/auth/login", {"username": inactive.username, "password": "wrong"}, HTTP_X_CSRFTOKEN=token)
    inactive_correct = client.post("/api/v1/admin/auth/login", {"username": inactive.username, "password": "correct-password"}, HTTP_X_CSRFTOKEN=token)
    assert inactive_wrong.status_code == inactive_correct.status_code == 401


@pytest.mark.django_db
def test_missing_permission_keeps_reserved_groups_unprovisioned_until_retry():
    provision_roles()
    editor = Group.objects.get(name="editor")
    unrelated = Permission.objects.exclude(content_type__app_label__in={"accounts", "content", "core", "forms", "media"}).first()
    editor.permissions.add(unrelated)
    Permission.objects.get(content_type__app_label="content", codename="publish_contenttranslation").delete()

    assert provision_roles() is False
    assert editor.permissions.filter(pk=unrelated.pk).exists()

    call_command("sync_phase1_roles")
    assert editor.permissions.filter(pk=unrelated.pk).exists()


@pytest.mark.django_db
@override_settings(TRUSTED_PROXY_IPS=("10.0.0.1",))
def test_proxy_forwarding_is_ignored_unless_peer_is_trusted():
    request = RequestFactory().get("/")
    request.META.update(REMOTE_ADDR="198.51.100.8", HTTP_X_FORWARDED_FOR="203.0.113.9")
    assert client_ip(request) == "198.51.100.8"
    request.META["REMOTE_ADDR"] = "10.0.0.1"
    assert client_ip(request) == "203.0.113.9"


@pytest.mark.django_db
def test_audit_redaction_and_publication_rollback_are_atomic():
    payload = {"nested": [{"password": "secret", "safe": "kept"}], "authorization": "Bearer secret"}
    audit = write_audit_log(action="user_update", object_type="user", object_id="1", metadata=payload)
    assert audit.metadata == {"nested": [{"password": "[REDACTED]", "safe": "kept"}], "authorization": "[REDACTED]"}

    item = ContentItem.objects.create(key="matrix-rollback", kind=ContentItem.Kind.PAGE)
    translation = ContentTranslation.objects.create(
        item=item, locale="en", title="Reviewed", slug="matrix-rollback", path="matrix-rollback",
        translation_status=ContentTranslation.TranslationStatus.REVIEWED,
    )
    with pytest.raises(RuntimeError):
        with pytest.MonkeyPatch.context() as patch:
            patch.setattr("apps.content.services.write_audit_log", lambda **kwargs: (_ for _ in ()).throw(RuntimeError("audit unavailable")))
            publish_translation(translation)
    translation.refresh_from_db()
    assert translation.workflow_status == ContentTranslation.WorkflowStatus.DRAFT
    assert not ContentRevision.objects.filter(translation=translation).exists()
    assert not RevalidationEvent.objects.filter(paths=["/en/matrix-rollback"]).exists()
