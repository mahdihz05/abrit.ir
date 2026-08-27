from django.contrib import admin, messages
from django.core.exceptions import PermissionDenied, ValidationError

from apps.accounts.roles import fixed_role_for_user

from .models import (
    ArticleProfile,
    Capability,
    CapabilityTranslation,
    ContentBlock,
    ContentItem,
    ContentRelation,
    ContentRevision,
    ContentTranslation,
    ServiceProfile,
    TaxonomyTerm,
    TaxonomyTranslation,
    Technology,
)
from .forms import ContentBlockAdminForm, ContentTranslationAdminForm
from .services import publish_translation, unpublish_translation


class ContentTranslationInline(admin.StackedInline):
    model = ContentTranslation
    form = ContentTranslationAdminForm
    extra = 0
    show_change_link = True
    fields = ("locale", "title", "slug", "path", "workflow_status", "translation_status", "publish_at")


class ContentRelationInline(admin.TabularInline):
    model = ContentRelation
    fk_name = "source"
    extra = 0
    autocomplete_fields = ("target",)


@admin.register(ContentItem)
class ContentItemAdmin(admin.ModelAdmin):
    inlines = (ContentTranslationInline, ContentRelationInline)
    list_display = ("key", "kind", "template_key", "is_active", "updated_at")
    list_filter = ("kind", "is_active", "template_key")
    search_fields = ("key", "translations__title", "translations__path")
    autocomplete_fields = ("parent",)
    actions = ()

    def has_change_permission(self, request, obj=None):
        if obj and obj.translations.filter(workflow_status=ContentTranslation.WorkflowStatus.PUBLISHED).exists():
            return False
        return super().has_change_permission(request, obj)

    def has_delete_permission(self, request, obj=None):
        return False


class ContentBlockInline(admin.StackedInline):
    model = ContentBlock
    form = ContentBlockAdminForm
    extra = 0
    ordering = ("order",)

    @staticmethod
    def _is_published(obj):
        return bool(obj and obj.workflow_status == ContentTranslation.WorkflowStatus.PUBLISHED)

    def has_add_permission(self, request, obj):
        if self._is_published(obj):
            return False
        return super().has_add_permission(request, obj)

    def has_change_permission(self, request, obj=None):
        if self._is_published(obj):
            return False
        return super().has_change_permission(request, obj)

    def has_delete_permission(self, request, obj=None):
        if self._is_published(obj):
            return False
        return super().has_delete_permission(request, obj)


@admin.register(ContentTranslation)
class ContentTranslationAdmin(admin.ModelAdmin):
    form = ContentTranslationAdminForm
    inlines = (ContentBlockInline,)
    list_display = ("title", "locale", "item", "workflow_status", "translation_status", "publish_at", "published_at")
    list_filter = ("locale", "workflow_status", "translation_status", "item__kind")
    search_fields = ("title", "path", "item__key")
    autocomplete_fields = ("item", "og_image")
    actions = ("publish_selected", "unpublish_selected")
    fieldsets = (
        ("Content", {"fields": ("item", "locale", "title", "slug", "path", "excerpt")}),
        ("Workflow", {"fields": ("workflow_status", "translation_status", "publish_at", "published_at", "source_revision")}),
        ("SEO", {"fields": ("seo_title", "seo_description", "canonical_url", "robots_index", "robots_follow", "og_title", "og_description", "og_image")}),
    )

    @admin.action(description="Publish selected reviewed translations")
    def publish_selected(self, request, queryset):
        if not self._can_publish(request.user):
            raise PermissionDenied
        success = 0
        for translation in queryset:
            try:
                publish_translation(translation, actor=request.user)
                success += 1
            except ValidationError as exc:
                self.message_user(request, f"{translation}: {exc}", messages.ERROR)
        if success:
            self.message_user(request, f"Published {success} translations.", messages.SUCCESS)

    @admin.action(description="Unpublish selected translations")
    def unpublish_selected(self, request, queryset):
        if not self._can_publish(request.user):
            raise PermissionDenied
        for translation in queryset:
            unpublish_translation(translation, actor=request.user)
        self.message_user(request, f"Unpublished {queryset.count()} translations.", messages.SUCCESS)

    def get_readonly_fields(self, request, obj=None):
        readonly = ("workflow_status", "publish_at", "published_at", "source_revision")
        if obj and obj.workflow_status == ContentTranslation.WorkflowStatus.PUBLISHED:
            return tuple(field.name for field in self.model._meta.fields)
        return readonly

    def has_change_permission(self, request, obj=None):
        if obj and obj.workflow_status == ContentTranslation.WorkflowStatus.PUBLISHED:
            return False
        return super().has_change_permission(request, obj)

    def has_delete_permission(self, request, obj=None):
        return False

    @staticmethod
    def _can_publish(user):
        if user.is_active and user.is_superuser:
            return True
        role = fixed_role_for_user(user) if user.is_active else None
        return role is not None and role.key == "publisher"


@admin.register(ContentRevision)
class ContentRevisionAdmin(admin.ModelAdmin):
    list_display = ("translation", "version", "source", "actor", "created_at")
    list_filter = ("source", "translation__locale", "translation__item__kind")
    search_fields = ("translation__title", "translation__item__key")
    readonly_fields = tuple(field.name for field in ContentRevision._meta.fields)

    def has_add_permission(self, request):
        return False


class CapabilityTranslationInline(admin.TabularInline):
    model = CapabilityTranslation
    extra = 0


@admin.register(Capability)
class CapabilityAdmin(admin.ModelAdmin):
    inlines = (CapabilityTranslationInline,)
    search_fields = ("key", "translations__name")


class TaxonomyTranslationInline(admin.TabularInline):
    model = TaxonomyTranslation
    extra = 0


@admin.register(TaxonomyTerm)
class TaxonomyTermAdmin(admin.ModelAdmin):
    inlines = (TaxonomyTranslationInline,)
    list_filter = ("kind",)
    search_fields = ("key", "translations__name")


admin.site.register(Technology)
admin.site.register(ServiceProfile)
admin.site.register(ArticleProfile)
