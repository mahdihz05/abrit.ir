from django.contrib import admin

from .models import MediaAsset, MediaAssetTranslation


class MediaTranslationInline(admin.StackedInline):
    model = MediaAssetTranslation
    extra = 0


@admin.register(MediaAsset)
class MediaAssetAdmin(admin.ModelAdmin):
    inlines = (MediaTranslationInline,)
    list_display = ("file", "media_type", "mime_type", "size", "is_public", "created_at")
    list_filter = ("media_type", "is_public")
    search_fields = ("file", "checksum_sha256", "translations__title", "translations__alt")
    readonly_fields = ("size", "mime_type", "width", "height", "checksum_sha256", "created_at", "updated_at")
