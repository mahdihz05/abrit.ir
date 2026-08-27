import pytest
from django.contrib import admin
from django.contrib.auth.admin import GroupAdmin
from django.contrib.auth.models import Group, Permission, User
from django.core.management import call_command
from django.test import RequestFactory

from .admin import FixedRoleUserAdmin, FixedRoleUserForm, ReservedGroupAdmin
from .roles import ROLE_BY_KEY, ROLE_DEFINITIONS, assign_fixed_role, fixed_role_for_user, provision_roles


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
