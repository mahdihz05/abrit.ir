from django import forms
from django.contrib import admin
from django.contrib.auth.admin import GroupAdmin, UserAdmin
from django.contrib.auth.models import Group, User
from django.core.exceptions import PermissionDenied

from .roles import ROLE_BY_KEY, assign_fixed_role, fixed_role_for_user
from .models import AccountSecurity
from .security import unlock_account


class ReservedGroupAdmin(GroupAdmin):
    """The provisioned roles are a visible, but never mutable, catalog."""

    list_display = ("name",)
    readonly_fields = ("name", "permissions")
    fields = ("name", "permissions")
    filter_horizontal = ()

    def has_add_permission(self, request):
        return False

    def has_change_permission(self, request, obj=None):
        return request.method in {"GET", "HEAD"} and request.user.is_active and request.user.is_staff

    def has_delete_permission(self, request, obj=None):
        return False


class FixedRoleUserForm(forms.ModelForm):
    fixed_role = forms.ChoiceField(required=False, choices=(("", "No fixed role"),))

    class Meta:
        model = User
        fields = "__all__"

    def __init__(self, *args, **kwargs):
        super().__init__(*args, **kwargs)
        self.fields["fixed_role"].choices = (("", "No fixed role"),) + tuple(
            (role.key, role.name) for role in ROLE_BY_KEY.values()
        )
        if self.instance.pk:
            role = fixed_role_for_user(self.instance)
            self.fields["fixed_role"].initial = role.key if role else ""

    def save(self, commit=True):
        user = super().save(commit=commit)
        if commit and not user.is_superuser:
            assign_fixed_role(user, self.cleaned_data["fixed_role"] or None)
        return user


class FixedRoleUserAdmin(UserAdmin):
    form = FixedRoleUserForm
    exclude = ("groups", "user_permissions")
    fieldsets = UserAdmin.fieldsets + (("Phase 1 role", {"fields": ("fixed_role",)}),)
    add_fieldsets = UserAdmin.add_fieldsets + (("Phase 1 role", {"fields": ("fixed_role",)}),)

    def has_module_permission(self, request):
        return request.user.is_active and request.user.is_superuser

    def has_view_permission(self, request, obj=None):
        return request.user.is_active and request.user.is_superuser

    def has_add_permission(self, request):
        return request.user.is_active and request.user.is_superuser

    def has_change_permission(self, request, obj=None):
        return request.user.is_active and request.user.is_superuser

    def has_delete_permission(self, request, obj=None):
        return False

    def save_model(self, request, obj, form, change):
        if not request.user.is_superuser:
            raise PermissionDenied
        super().save_model(request, obj, form, change)
        if not obj.is_superuser:
            assign_fixed_role(obj, form.cleaned_data["fixed_role"] or None)


admin.site.unregister(Group)
admin.site.unregister(User)
admin.site.register(Group, ReservedGroupAdmin)
admin.site.register(User, FixedRoleUserAdmin)


@admin.register(AccountSecurity)
class AccountSecurityAdmin(admin.ModelAdmin):
    list_display = ("user", "failed_attempts", "locked_until")
    readonly_fields = ("user", "failed_attempts", "locked_until", "updated_at")
    actions = ("unlock_selected",)

    def has_module_permission(self, request):
        return request.user.is_active and request.user.is_superuser

    def has_view_permission(self, request, obj=None):
        return request.user.is_active and request.user.is_superuser

    def has_change_permission(self, request, obj=None):
        return False

    def has_add_permission(self, request):
        return False

    def has_delete_permission(self, request, obj=None):
        return False

    @admin.action(description="Unlock selected accounts")
    def unlock_selected(self, request, queryset):
        for security in queryset.select_related("user"):
            unlock_account(security.user, actor=request.user)
