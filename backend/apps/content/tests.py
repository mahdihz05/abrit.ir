from datetime import timedelta

import pytest
from django.contrib import admin
from django.contrib.auth.models import Group, Permission, User
from django.core.management import call_command
from django.core.exceptions import PermissionDenied, ValidationError
from django.test import RequestFactory
from django.utils import timezone
from rest_framework.test import APIClient

from apps.core.models import RevalidationEvent
from apps.accounts.roles import assign_fixed_role, provision_roles

from .admin import ContentBlockInline, ContentItemAdmin, ContentTranslationAdmin, ContentTranslationInline
from .forms import ContentBlockAdminForm, ContentTranslationAdminForm
from .models import ContentBlock, ContentItem, ContentRevision, ContentTranslation
from .services import publish_translation, restore_revision, unpublish_translation
from .workflow import workflow_transition


@pytest.mark.django_db
def test_only_reviewed_translation_can_publish():
    item = ContentItem.objects.create(key="test", kind=ContentItem.Kind.PAGE)
    translation = ContentTranslation.objects.create(item=item, locale="fa", title="آزمایش", slug="test", path="test")
    with pytest.raises(ValidationError):
        publish_translation(translation)


@pytest.mark.django_db
def test_publish_creates_revision_and_revalidation_event():
    item = ContentItem.objects.create(key="reviewed", kind=ContentItem.Kind.PAGE)
    translation = ContentTranslation.objects.create(
        item=item,
        locale="fa",
        title="بررسی‌شده",
        slug="reviewed",
        path="reviewed",
        translation_status=ContentTranslation.TranslationStatus.REVIEWED,
    )
    publish_translation(translation)
    assert ContentRevision.objects.filter(translation=translation, version=1).exists()
    assert RevalidationEvent.objects.filter(paths=["/fa/reviewed"]).exists()


@pytest.mark.django_db
def test_publish_rolls_back_when_its_required_audit_write_fails(monkeypatch):
    item = ContentItem.objects.create(key="audit-rollback", kind=ContentItem.Kind.PAGE)
    translation = ContentTranslation.objects.create(
        item=item,
        locale="fa",
        title="بررسی‌شده",
        slug="audit-rollback",
        path="audit-rollback",
        translation_status=ContentTranslation.TranslationStatus.REVIEWED,
    )

    def fail_audit(**kwargs):
        raise RuntimeError("audit unavailable")

    monkeypatch.setattr("apps.content.services.write_audit_log", fail_audit)
    with pytest.raises(RuntimeError, match="audit unavailable"):
        publish_translation(translation)

    translation.refresh_from_db()
    assert translation.workflow_status == ContentTranslation.WorkflowStatus.DRAFT
    assert translation.published_at is None
    assert not ContentRevision.objects.filter(translation=translation).exists()
    assert not RevalidationEvent.objects.filter(paths=["/fa/audit-rollback"]).exists()


@pytest.mark.django_db
def test_block_props_are_schema_validated():
    item = ContentItem.objects.create(key="blocks", kind=ContentItem.Kind.PAGE)
    translation = ContentTranslation.objects.create(item=item, locale="fa", title="بلوک", slug="blocks", path="blocks")
    block = ContentBlock(translation=translation, block_type="hero", order=0, props={})
    with pytest.raises(ValidationError):
        block.full_clean()


@pytest.mark.django_db
def test_missing_locale_never_falls_back():
    item = ContentItem.objects.create(key="fa-only", kind=ContentItem.Kind.PAGE)
    with workflow_transition():
        ContentTranslation.objects.create(
            item=item,
            locale="fa",
            title="فقط فارسی",
            slug="fa-only",
            path="fa-only",
            workflow_status=ContentTranslation.WorkflowStatus.PUBLISHED,
            translation_status=ContentTranslation.TranslationStatus.REVIEWED,
            published_at=timezone.now(),
        )
    response = APIClient().get("/api/v1/content/en/fa-only")
    assert response.status_code == 404


@pytest.mark.django_db
def test_detail_alternates_only_include_published_reviewed_translations():
    item = ContentItem.objects.create(key="alternates", kind=ContentItem.Kind.PAGE)
    now = timezone.now()
    with workflow_transition():
        ContentTranslation.objects.create(
            item=item, locale="en", title="Alternates", slug="alternates", path="alternates",
            workflow_status=ContentTranslation.WorkflowStatus.PUBLISHED,
            translation_status=ContentTranslation.TranslationStatus.REVIEWED,
            published_at=now,
        )
    ContentTranslation.objects.create(
        item=item, locale="fa", title="Draft", slug="alternates-fa", path="alternates-fa",
        workflow_status=ContentTranslation.WorkflowStatus.DRAFT,
        translation_status=ContentTranslation.TranslationStatus.REVIEWED,
    )

    response = APIClient().get("/api/v1/content/en/alternates")
    assert response.status_code == 200
    assert response.json()["data"]["alternates"] == [{"locale": "en", "url": "/en/alternates"}]


@pytest.mark.django_db
def test_revision_can_be_restored_with_a_new_audit_revision():
    item = ContentItem.objects.create(key="restore", kind=ContentItem.Kind.PAGE)
    translation = ContentTranslation.objects.create(
        item=item, locale="en", title="Original", slug="restore", path="restore",
        translation_status=ContentTranslation.TranslationStatus.REVIEWED,
    )
    publish_translation(translation)
    revision = translation.revisions.get(version=1)
    translation.title = "Changed"
    with workflow_transition():
        translation.save(update_fields=("title", "updated_at"))
    restore_revision(revision)
    translation.refresh_from_db()
    assert translation.title == "Original"
    assert translation.revisions.count() == 2
    assert RevalidationEvent.objects.filter(paths=["/en/restore"]).count() == 2


@pytest.mark.django_db
def test_due_reviewed_content_is_published_by_command():
    item = ContentItem.objects.create(key="scheduled", kind=ContentItem.Kind.PAGE)
    translation = ContentTranslation.objects.create(
        item=item, locale="en", title="Scheduled", slug="scheduled", path="scheduled",
        workflow_status=ContentTranslation.WorkflowStatus.SCHEDULED,
        translation_status=ContentTranslation.TranslationStatus.REVIEWED,
        publish_at=timezone.now() - timedelta(minutes=1),
    )
    call_command("publish_scheduled")
    translation.refresh_from_db()
    assert translation.workflow_status == ContentTranslation.WorkflowStatus.PUBLISHED
    assert translation.published_at is not None


@pytest.mark.django_db
def test_admin_form_rejects_crafted_workflow_field_change():
    item = ContentItem.objects.create(key="form-workflow", kind=ContentItem.Kind.PAGE)
    translation = ContentTranslation.objects.create(
        item=item, locale="en", title="Draft", slug="draft", path="draft",
        translation_status=ContentTranslation.TranslationStatus.REVIEWED,
    )
    form = ContentTranslationAdminForm(
        data={
            "item": item.pk, "locale": "en", "title": "Draft", "slug": "draft", "path": "draft",
            "workflow_status": ContentTranslation.WorkflowStatus.PUBLISHED,
            "translation_status": ContentTranslation.TranslationStatus.REVIEWED,
            "publish_at": "", "published_at": "", "source_revision": "", "excerpt": "",
            "seo_title": "", "seo_description": "", "canonical_url": "", "robots_index": "on",
            "robots_follow": "on", "og_title": "", "og_description": "", "og_image": "",
        }, instance=translation,
    )
    assert not form.is_valid()
    assert "controlled by the publication service" in str(form.errors)


@pytest.mark.django_db
def test_admin_form_rejects_crafted_edit_of_published_translation():
    item = ContentItem.objects.create(key="form-published", kind=ContentItem.Kind.PAGE)
    translation = ContentTranslation.objects.create(
        item=item, locale="en", title="Reviewed", slug="reviewed", path="form-published",
        translation_status=ContentTranslation.TranslationStatus.REVIEWED,
    )
    publish_translation(translation)
    translation.refresh_from_db()
    form = ContentTranslationAdminForm(instance=translation, data={
        "item": item.pk, "locale": "en", "title": "Crafted edit", "slug": "reviewed",
        "path": "form-published", "workflow_status": ContentTranslation.WorkflowStatus.PUBLISHED,
        "translation_status": ContentTranslation.TranslationStatus.REVIEWED, "publish_at": "",
        "published_at": translation.published_at.isoformat(), "source_revision": "", "excerpt": "",
        "seo_title": "", "seo_description": "", "canonical_url": "", "robots_index": "on",
        "robots_follow": "on", "og_title": "", "og_description": "", "og_image": "",
    })
    assert not form.is_valid()
    assert "immutable" in str(form.errors)


@pytest.mark.django_db
def test_direct_save_cannot_enter_published_state():
    item = ContentItem.objects.create(key="direct-published", kind=ContentItem.Kind.PAGE)
    translation = ContentTranslation.objects.create(
        item=item, locale="en", title="Draft", slug="draft", path="direct-published",
        translation_status=ContentTranslation.TranslationStatus.REVIEWED,
    )
    translation.workflow_status = ContentTranslation.WorkflowStatus.PUBLISHED
    translation.published_at = timezone.now()
    with pytest.raises(ValidationError, match="controlled by the publication service"):
        translation.save()


@pytest.mark.django_db
def test_direct_save_cannot_leave_published_but_trusted_unpublish_can():
    item = ContentItem.objects.create(key="direct-unpublish", kind=ContentItem.Kind.PAGE)
    translation = ContentTranslation.objects.create(
        item=item, locale="en", title="Reviewed", slug="reviewed", path="direct-unpublish",
        translation_status=ContentTranslation.TranslationStatus.REVIEWED,
    )
    publish_translation(translation)
    translation.refresh_from_db()
    translation.workflow_status = ContentTranslation.WorkflowStatus.DRAFT
    with pytest.raises(ValidationError, match="controlled by the publication service"):
        translation.save()
    unpublish_translation(translation)
    translation.refresh_from_db()
    assert translation.workflow_status == ContentTranslation.WorkflowStatus.DRAFT


def _request_for(user, method="post"):
    request = getattr(RequestFactory(), method)("/admin/content/")
    request.user = user
    return request


@pytest.mark.django_db
@pytest.mark.parametrize("bypass_kind", ("editor", "extra-group", "direct-permission"))
def test_crafted_publication_action_rejects_editor_and_permission_bypasses(bypass_kind):
    provision_roles()
    user = User.objects.create_user(f"publish-{bypass_kind}")
    assign_fixed_role(user, "editor")
    if bypass_kind == "extra-group":
        extra = Group.objects.create(name="publish-escalation")
        extra.permissions.add(Permission.objects.get(
            content_type__app_label="content", codename="publish_contenttranslation"
        ))
        user.groups.add(extra)
    elif bypass_kind == "direct-permission":
        user.user_permissions.add(Permission.objects.get(
            content_type__app_label="content", codename="publish_contenttranslation"
        ))
    item = ContentItem.objects.create(key=f"action-{bypass_kind}", kind=ContentItem.Kind.PAGE)
    translation = ContentTranslation.objects.create(
        item=item, locale="en", title="Reviewed", slug="reviewed", path=f"action-{bypass_kind}",
        translation_status=ContentTranslation.TranslationStatus.REVIEWED,
    )
    model_admin = ContentTranslationAdmin(ContentTranslation, admin.site)
    with pytest.raises(PermissionDenied):
        model_admin.publish_selected(_request_for(user), ContentTranslation.objects.filter(pk=translation.pk))
    with pytest.raises(PermissionDenied):
        model_admin.unpublish_selected(_request_for(user), ContentTranslation.objects.filter(pk=translation.pk))
    translation.refresh_from_db()
    assert translation.workflow_status == ContentTranslation.WorkflowStatus.DRAFT


@pytest.mark.django_db
def test_publisher_admin_action_uses_trusted_publication_service():
    provision_roles()
    publisher = User.objects.create_user("publisher-action")
    assign_fixed_role(publisher, "publisher")
    item = ContentItem.objects.create(key="publisher-action", kind=ContentItem.Kind.PAGE)
    translation = ContentTranslation.objects.create(
        item=item, locale="en", title="Reviewed", slug="reviewed", path="publisher-action",
        translation_status=ContentTranslation.TranslationStatus.REVIEWED,
    )
    model_admin = ContentTranslationAdmin(ContentTranslation, admin.site)
    model_admin.message_user = lambda *args, **kwargs: None
    model_admin.publish_selected(_request_for(publisher), ContentTranslation.objects.filter(pk=translation.pk))
    translation.refresh_from_db()
    assert translation.workflow_status == ContentTranslation.WorkflowStatus.PUBLISHED
    assert translation.revisions.exists()
    assert RevalidationEvent.objects.filter(paths=["/en/publisher-action"]).exists()


@pytest.mark.django_db
def test_crafted_inline_and_block_mutations_reject_published_content():
    item = ContentItem.objects.create(key="inline-guard", kind=ContentItem.Kind.PAGE)
    translation = ContentTranslation.objects.create(
        item=item, locale="en", title="Reviewed", slug="reviewed", path="inline-guard",
        translation_status=ContentTranslation.TranslationStatus.REVIEWED,
    )
    block = ContentBlock.objects.create(
        translation=translation, block_type="rich_text", order=0, props={"html": "<p>safe</p>"}
    )
    publish_translation(translation)
    translation.refresh_from_db()
    request = _request_for(User.objects.create_superuser("content-admin"), "get")
    translation_inline = ContentTranslationInline(ContentItem, admin.site)
    assert translation_inline.form is ContentTranslationAdminForm
    assert translation_inline.has_add_permission(request, item) is True
    block_inline = ContentBlockInline(ContentTranslation, admin.site)
    assert block_inline.has_add_permission(request, translation) is False
    assert block_inline.has_change_permission(request, translation) is False
    assert block_inline.has_delete_permission(request, translation) is False
    block.props = {"html": "<p>changed</p>"}
    with pytest.raises(ValidationError, match="controlled by the publication service"):
        block.save()
    with pytest.raises(ValidationError, match="controlled by the publication service"):
        block.delete()
    form = ContentBlockAdminForm(instance=block, data={
        "translation": translation.pk, "block_type": "rich_text", "variant": "default", "order": 0,
        "is_active": "on", "schema_version": 1, "props": '{"html":"<p>changed</p>"}',
    })
    assert not form.is_valid()
    assert "immutable" in str(form.errors)


@pytest.mark.django_db
def test_crafted_archive_and_admin_change_reject_published_content():
    item = ContentItem.objects.create(key="archive-guard", kind=ContentItem.Kind.PAGE)
    translation = ContentTranslation.objects.create(
        item=item, locale="en", title="Reviewed", slug="reviewed", path="archive-guard",
        translation_status=ContentTranslation.TranslationStatus.REVIEWED,
    )
    publish_translation(translation)
    item.is_active = False
    with pytest.raises(ValidationError, match="workflow service"):
        item.save()
    item_admin = ContentItemAdmin(ContentItem, admin.site)
    assert item_admin.actions == ()
    assert item_admin.has_change_permission(_request_for(User(is_active=True, is_staff=True), "get"), item) is False
