from django.contrib import admin, messages
from django.core.exceptions import ValidationError

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
from .services import publish_translation, unpublish_translation


class ContentTranslationInline(admin.StackedInline):
    model = ContentTranslation
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
    actions = ("archive_items",)

    @admin.action(description="Archive/deactivate selected content")
    def archive_items(self, request, queryset):
        updated = queryset.update(is_active=False)
        self.message_user(request, f"{updated} content items deactivated.", messages.SUCCESS)

    def has_delete_permission(self, request, obj=None):
        return False


class ContentBlockInline(admin.StackedInline):
    model = ContentBlock
    extra = 0
    ordering = ("order",)


@admin.register(ContentTranslation)
class ContentTranslationAdmin(admin.ModelAdmin):
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
        for translation in queryset:
            unpublish_translation(translation, actor=request.user)
        self.message_user(request, f"Unpublished {queryset.count()} translations.", messages.SUCCESS)


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
