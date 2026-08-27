import pytest
from django.contrib import admin
from django.contrib.auth.admin import GroupAdmin
from django.contrib.auth.models import Group, Permission, User
from django.core.management import call_command
from django.test import RequestFactory
from django.test import Client, override_settings

from .admin import FixedRoleUserAdmin, FixedRoleUserForm, ReservedGroupAdmin
from .roles import ROLE_BY_KEY, ROLE_DEFINITIONS, assign_fixed_role, fixed_role_for_user, provision_roles
from .models import AccountSecurity
from .security import client_ip, unlock_account


@pytest.mark.django_db
def test_role_provisioning_is_exact_and_idempotent():
    assert provision_roles()
    for role in ROLE_DEFINITIONS:
        group = Group.objects.get(name=role.key)
        actual = {f"{app}.{codename}" for app, codename in group.permissions.values_list(
            "content_type__app_label", "codename"
        )}
        assert actual == set(role.permissions)
    editor = Group.objects.get(name="editor")
    editor.permissions.clear()
    assert provision_roles()
    assert editor.permissions.count() == len(ROLE_BY_KEY["editor"].permissions)


@pytest.mark.django_db
def test_provisioning_does_nothing_while_a_required_permission_is_missing():
    assert provision_roles()
    editor = Group.objects.get(name="editor")
    unrelated = Permission.objects.exclude(
        content_type__app_label__in={"accounts", "content", "core", "forms", "media"}
    ).first()
    editor.permissions.add(unrelated)
    Permission.objects.get(
        content_type__app_label="content", codename="publish_contenttranslation"
    ).delete()
    assert provision_roles() is False
    assert editor.permissions.filter(pk=unrelated.pk).exists()


@pytest.mark.django_db
def test_sync_command_recovers_a_tampered_group():
    provision_roles()
    group = Group.objects.get(name="auditor")
    group.permissions.clear()
    call_command("sync_phase1_roles")
    assert group.permissions.count() == len(ROLE_BY_KEY["auditor"].permissions)


@pytest.mark.django_db
def test_fixed_role_assignment_replaces_groups_and_direct_permissions():
    provision_roles()
    user = User.objects.create_user("person")
    extra = Group.objects.create(name="extra")
    user.groups.add(extra)
    user.user_permissions.add(Permission.objects.first())
    assign_fixed_role(user, "auditor")
    user.refresh_from_db()
    assert list(user.groups.values_list("name", flat=True)) == ["auditor"]
    assert not user.user_permissions.exists()
    assert not user.is_staff
    assert fixed_role_for_user(user).key == "auditor"


@pytest.mark.django_db
@pytest.mark.parametrize(
    ("role_key", "expected_staff"),
    (("editor", True), ("publisher", True), ("submission-reviewer", True), ("auditor", False)),
)
def test_role_assignment_synchronizes_staff_for_full_matrix(role_key, expected_staff):
    provision_roles()
    user = User.objects.create_user(f"user-{role_key}", is_staff=not expected_staff)
    assign_fixed_role(user, role_key)
    user.refresh_from_db()
    assert user.is_staff is expected_staff
    assert fixed_role_for_user(user).key == role_key


@pytest.mark.django_db
def test_clearing_fixed_role_removes_staff_access():
    provision_roles()
    user = User.objects.create_user("no-role", is_staff=True)
    assign_fixed_role(user, "editor")
    assign_fixed_role(user, None)
    user.refresh_from_db()
    assert user.is_staff is False
    assert fixed_role_for_user(user) is None


@pytest.mark.django_db
def test_user_admin_applies_fixed_role_on_normal_save_path():
    provision_roles()
    user = User.objects.create_user("admin-role")
    form = FixedRoleUserForm(instance=user)
    form.cleaned_data = {"fixed_role": "publisher"}
    obj = user
    model_admin = FixedRoleUserAdmin(User, admin.site)
    request = RequestFactory().post("/admin/auth/user/1/change/")
    request.user = User.objects.create_superuser("role-admin")
    model_admin.save_model(request, obj, form, True)
    user.refresh_from_db()
    assert fixed_role_for_user(user).key == "publisher"


@pytest.mark.django_db
def test_extra_group_or_direct_permission_invalidates_fixed_role_identity():
    provision_roles()
    user = User.objects.create_user("bypass")
    assign_fixed_role(user, "editor")
    user.groups.add(Group.objects.create(name="unreserved-escalation"))
    assert fixed_role_for_user(user) is None
    user.groups.set((Group.objects.get(name="editor"),))
    user.user_permissions.add(Permission.objects.get(
        content_type__app_label="content", codename="publish_contenttranslation"
    ))
    assert fixed_role_for_user(user) is None


@pytest.mark.django_db
def test_group_admin_rejects_all_supported_mutations():
    user = User.objects.create_superuser("root")
    group_admin = ReservedGroupAdmin(Group, admin.site)
    request = RequestFactory().post("/admin/auth/group/1/change/")
    request.user = user
    assert group_admin.has_add_permission(request) is False
    assert group_admin.has_change_permission(request, Group(name="editor")) is False
    assert group_admin.has_delete_permission(request, Group(name="editor")) is False
    assert isinstance(group_admin, GroupAdmin)


@pytest.mark.django_db
def test_auth_csrf_login_session_and_logout_contract():
    provision_roles()
    user = User.objects.create_superuser("root", password="correct horse battery staple")
    client = Client(enforce_csrf_checks=True)
    csrf_response = client.get("/api/v1/admin/auth/csrf")
    assert csrf_response.status_code == 200
    token = csrf_response.json()["data"]["csrf_token"]
    csrf_failure = client.post("/api/v1/admin/auth/login", {"username": user.username, "password": "wrong"})
    assert csrf_failure.status_code == 403 and csrf_failure.json()["error"]["code"] == "csrf_failed"
    login_response = client.post(
        "/api/v1/admin/auth/login", {"username": user.username, "password": "correct horse battery staple"},
        HTTP_X_CSRFTOKEN=token,
    )
    assert login_response.status_code == 200
    assert login_response.json()["data"]["user"]["role"] is None
    assert client.get("/api/v1/admin/auth/session").status_code == 200
    rotated_token = client.cookies["abrit_csrf"].value
    assert client.post("/api/v1/admin/auth/logout", {}, HTTP_X_CSRFTOKEN=rotated_token).json() == {"data": None}


@pytest.mark.django_db
def test_login_lockout_is_persistent_and_correct_password_is_non_enumerating():
    user = User.objects.create_user("editor", password="right-password")
    client = Client(enforce_csrf_checks=True)
    token = client.get("/api/v1/admin/auth/csrf").json()["data"]["csrf_token"]
    for _ in range(4):
        response = client.post("/api/v1/admin/auth/login", {"username": "editor", "password": "wrong"}, HTTP_X_CSRFTOKEN=token)
        assert response.status_code == 401
    response = client.post("/api/v1/admin/auth/login", {"username": "editor", "password": "wrong"}, HTTP_X_CSRFTOKEN=token)
    assert response.status_code == 401
    security = AccountSecurity.objects.get(user=user)
    assert security.failed_attempts == 5 and security.locked_until is not None
    response = client.post("/api/v1/admin/auth/login", {"username": "editor", "password": "right-password"}, HTTP_X_CSRFTOKEN=token)
    assert response.status_code == 403 and response.json()["error"]["code"] == "account_locked"
    unknown = client.post("/api/v1/admin/auth/login", {"username": "nobody", "password": "wrong"}, HTTP_X_CSRFTOKEN=token)
    assert unknown.status_code == 401 and unknown.json()["error"]["code"] == "authentication_failed"
    unlock_account(user)
    assert AccountSecurity.objects.get(user=user).locked_until is None


@override_settings(TRUSTED_PROXY_IPS=("10.0.0.1",))
def test_client_ip_uses_forwarded_header_only_from_trusted_peer():
    request = RequestFactory().get("/", HTTP_X_FORWARDED_FOR="203.0.113.9, 10.0.0.2")
    request.META["REMOTE_ADDR"] = "198.51.100.8"
    assert client_ip(request) == "198.51.100.8"
    request.META["REMOTE_ADDR"] = "10.0.0.1"
    assert client_ip(request) == "203.0.113.9"
