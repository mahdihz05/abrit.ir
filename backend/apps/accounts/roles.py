from __future__ import annotations

from dataclasses import dataclass

from django.contrib.auth.models import Group, Permission
from django.db import transaction


@dataclass(frozen=True)
class RoleDefinition:
    key: str
    name: str
    requires_django_staff: bool
    permissions: tuple[str, ...]


COMMON = (
    "accounts.access_admin", "accounts.view_dashboard", "accounts.view_role_catalog",
)
EDITOR = COMMON + (
    "content.view_contentitem", "content.add_contentitem", "content.change_contentitem",
    "content.view_contenttranslation", "content.add_contenttranslation", "content.change_contenttranslation",
    "content.view_contentblock", "content.add_contentblock", "content.change_contentblock", "content.delete_contentblock",
    "content.view_contentrelation", "content.add_contentrelation", "content.change_contentrelation", "content.delete_contentrelation",
    "media.view_mediaasset", "media.add_mediaasset", "media.change_mediaasset",
    "media.view_mediaassettranslation", "media.add_mediaassettranslation", "media.change_mediaassettranslation",
)

ROLE_DEFINITIONS = (
    RoleDefinition("editor", "Editor", True, EDITOR),
    RoleDefinition("publisher", "Publisher", True, EDITOR + ("content.publish_contenttranslation",)),
    RoleDefinition("submission-reviewer", "Submission Reviewer", True, COMMON + (
        "forms.view_formsubmission", "forms.change_formsubmission", "forms.view_submissionfile",
    )),
    RoleDefinition("auditor", "Auditor", False, COMMON + ("core.view_auditlog",)),
)
ROLE_BY_KEY = {role.key: role for role in ROLE_DEFINITIONS}


def _permissions_by_key(*, using: str) -> dict[str, Permission]:
    permissions = Permission.objects.using(using).select_related("content_type").filter(
        content_type__app_label__in={key.split(".")[0] for role in ROLE_DEFINITIONS for key in role.permissions}
    )
    return {f"{permission.content_type.app_label}.{permission.codename}": permission for permission in permissions}


def provision_roles(*, using: str = "default") -> bool:
    """Reconcile reserved groups once all permissions are available.

    Returning False is intentional during intermediate post_migrate events: the
    accounts receiver will be invoked again after subsequent applications.
    """
    permission_map = _permissions_by_key(using=using)
    required = {key for role in ROLE_DEFINITIONS for key in role.permissions}
    if not required.issubset(permission_map):
        return False
    with transaction.atomic(using=using):
        for role in ROLE_DEFINITIONS:
            group, _ = Group.objects.using(using).get_or_create(name=role.key)
            group.permissions.set([permission_map[key] for key in role.permissions])
    return True


@transaction.atomic
def assign_fixed_role(user, role_key: str | None):
    """Replace all groups and direct grants with the selected reserved role."""
    if user.is_superuser:
        raise ValueError("Superusers do not have an assignable fixed role.")
    if role_key is None:
        user.groups.clear()
        user.user_permissions.clear()
        user.is_staff = False
        user.save(update_fields=("is_staff",))
        return
    role = ROLE_BY_KEY[role_key]
    group = Group.objects.get(name=role.key)
    user.groups.set((group,))
    user.user_permissions.clear()
    user.is_staff = role.requires_django_staff
    user.save(update_fields=("is_staff",))


def fixed_role_for_user(user) -> RoleDefinition | None:
    if user.is_superuser:
        return None
    if user.user_permissions.exists():
        return None
    role_names = set(user.groups.values_list("name", flat=True))
    matching = role_names.intersection(ROLE_BY_KEY)
    return ROLE_BY_KEY[next(iter(matching))] if len(matching) == 1 and len(role_names) == 1 else None
