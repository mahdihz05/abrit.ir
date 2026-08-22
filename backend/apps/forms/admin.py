from django.contrib import admin

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
    readonly_fields = ("original_name", "mime_type", "size", "checksum_sha256", "file", "created_at")


@admin.register(FormSubmission)
class FormSubmissionAdmin(admin.ModelAdmin):
    inlines = (SubmissionFileInline,)
    list_display = ("form", "locale", "consent_given", "created_at", "expires_at")
    list_filter = ("form", "locale", "consent_given")
    search_fields = ("data",)
    readonly_fields = ("form", "locale", "data", "consent_given", "consent_text", "user_agent", "ip_hash", "expires_at", "created_at", "updated_at")

    def has_add_permission(self, request):
        return False
