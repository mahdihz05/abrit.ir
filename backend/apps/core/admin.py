from django.contrib import admin

from .models import AuditLog, DesignSettings, RevalidationEvent, SiteSettings, SiteSettingsTranslation


class SiteSettingsTranslationInline(admin.StackedInline):
    model = SiteSettingsTranslation
    extra = 0
    min_num = 3


@admin.register(SiteSettings)
class SiteSettingsAdmin(admin.ModelAdmin):
    inlines = (SiteSettingsTranslationInline,)
    fieldsets = (
        ("Brand", {"fields": ("brand_name", "logo", "favicon")}),
        ("Contact", {"fields": ("phone", "email", "social_links")}),
        ("Website", {"fields": ("default_locale", "customer_portal_url", "external_checkout_url")}),
    )

    def has_add_permission(self, request):
        return not SiteSettings.objects.exists()

    def has_delete_permission(self, request, obj=None):
        return False


@admin.register(DesignSettings)
class DesignSettingsAdmin(admin.ModelAdmin):
    fieldsets = (
        ("Colors", {"fields": ("primary", "secondary", "accent", "background", "surface", "foreground", "muted")}),
        ("Geometry", {"fields": ("radius_small", "radius_medium", "radius_large", "container_width", "section_spacing")}),
        ("Motion", {"fields": ("motion_enabled",)}),
    )

    def has_add_permission(self, request):
        return not DesignSettings.objects.exists()

    def has_delete_permission(self, request, obj=None):
        return False


@admin.register(AuditLog)
class AuditLogAdmin(admin.ModelAdmin):
    list_display = ("timestamp", "action", "object_type", "object_id", "actor", "actor_type")
    list_filter = ("action", "actor_type", "object_type")
    search_fields = ("object_id", "action")
    readonly_fields = tuple(field.name for field in AuditLog._meta.fields)

    def has_add_permission(self, request):
        return False

    def has_delete_permission(self, request, obj=None):
        return False


@admin.register(RevalidationEvent)
class RevalidationEventAdmin(admin.ModelAdmin):
    list_display = ("created_at", "status", "attempts", "sent_at")
    list_filter = ("status",)
    readonly_fields = ("tags", "paths", "attempts", "last_error", "sent_at", "created_at", "updated_at")
