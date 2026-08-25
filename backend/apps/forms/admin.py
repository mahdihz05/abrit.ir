from django.contrib import admin
from django.urls import reverse
from django.utils.html import format_html

from .models import Form, FormField, FormFieldTranslation, FormSubmission, FormTranslation, SubmissionFile


class FormTranslationInline(admin.StackedInline):
    model = FormTranslation
    extra = 0


class FormFieldInline(admin.TabularInline):
    model = FormField
    extra = 0
    show_change_link = True


@admin.register(Form)
class FormAdmin(admin.ModelAdmin):
    inlines = (FormTranslationInline, FormFieldInline)
    list_display = ("key", "is_active", "requires_privacy_consent", "retention_months", "updated_at")
    list_filter = ("is_active", "requires_privacy_consent")
    search_fields = ("key", "translations__title")


class FormFieldTranslationInline(admin.StackedInline):
    model = FormFieldTranslation
    extra = 0


@admin.register(FormField)
class FormFieldAdmin(admin.ModelAdmin):
    inlines = (FormFieldTranslationInline,)
    list_display = ("form", "key", "field_type", "required", "order", "is_active")
    list_filter = ("form", "field_type", "required", "is_active")
    search_fields = ("key", "translations__label")


class SubmissionFileInline(admin.TabularInline):
    model = SubmissionFile
    extra = 0
    can_delete = False
    fields = ("original_name", "mime_type", "size", "checksum_sha256", "download_link", "created_at")
    readonly_fields = ("original_name", "mime_type", "size", "checksum_sha256", "download_link", "created_at")

    @admin.display(description="Private download")
    def download_link(self, obj):
        if not obj.pk:
            return "—"
        url = reverse("admin-submission-file-download", kwargs={"file_id": obj.pk})
        return format_html('<a href="{}">Download {}</a>', url, obj.original_name)


@admin.register(FormSubmission)
class FormSubmissionAdmin(admin.ModelAdmin):
    inlines = (SubmissionFileInline,)
    list_display = ("contact_name", "contact_phone", "form", "status", "locale", "created_at")
    list_filter = ("status", "form", "locale", "consent_given")
    search_fields = ("data",)
    readonly_fields = ("form", "locale", "data", "source_url", "referrer", "consent_given", "consent_text", "user_agent", "ip_hash", "expires_at", "created_at", "updated_at")
    fields = ("form", "status", "locale", "data", "source_url", "referrer", "consent_given", "consent_text", "user_agent", "ip_hash", "expires_at", "internal_notes", "created_at", "updated_at")
    actions = ("mark_as_contacted",)

    @admin.display(description="Name", ordering="created_at")
    def contact_name(self, obj):
        return obj.data.get("full_name", "—")

    @admin.display(description="Phone")
    def contact_phone(self, obj):
        return obj.data.get("phone", "—")

    @admin.action(description="Mark selected requests as contacted")
    def mark_as_contacted(self, request, queryset):
        queryset.update(status=FormSubmission.Status.CONTACTED)

    def has_add_permission(self, request):
        return False
