from __future__ import annotations

import hashlib

from django.core.exceptions import ValidationError
from django.db import models
from django.utils import timezone

from apps.core.models import LOCALE_CHOICES, UUIDTimestampedModel

from .storage import private_submission_storage
from .validators import validate_submission_file


class Form(UUIDTimestampedModel):
    key = models.SlugField(max_length=100, unique=True)
    is_active = models.BooleanField(default=True)
    requires_privacy_consent = models.BooleanField(default=True)
    retention_months = models.PositiveSmallIntegerField(default=12)
    success_redirect = models.CharField(max_length=500, blank=True)

    def clean(self):
        super().clean()
        if not 1 <= self.retention_months <= 24:
            raise ValidationError({"retention_months": "Retention must be between 1 and 24 months."})

    def __str__(self):
        return self.key


class FormTranslation(UUIDTimestampedModel):
    form = models.ForeignKey(Form, on_delete=models.CASCADE, related_name="translations")
    locale = models.CharField(max_length=10, choices=LOCALE_CHOICES)
    title = models.CharField(max_length=180)
    description = models.TextField(blank=True)
    success_message = models.TextField()
    consent_label = models.TextField(blank=True)

    class Meta:
        constraints = [models.UniqueConstraint(fields=("form", "locale"), name="unique_form_locale")]


class FormField(UUIDTimestampedModel):
    class FieldType(models.TextChoices):
        TEXT = "text", "Text"
        TEXTAREA = "textarea", "Textarea"
        EMAIL = "email", "Email"
        PHONE = "phone", "Phone"
        NUMBER = "number", "Number"
        SELECT = "select", "Select"
        MULTI_SELECT = "multi-select", "Multi-select"
        RADIO = "radio", "Radio"
        CHECKBOX = "checkbox", "Checkbox"
        DATE = "date", "Date"
        DATETIME = "datetime", "Datetime"
        URL = "url", "URL"
        FILE = "file", "File"
        HIDDEN = "hidden", "Hidden"

    form = models.ForeignKey(Form, on_delete=models.CASCADE, related_name="fields")
    key = models.SlugField(max_length=80)
    field_type = models.CharField(max_length=20, choices=FieldType.choices)
    required = models.BooleanField(default=False)
    min_value = models.DecimalField(max_digits=18, decimal_places=4, blank=True, null=True)
    max_value = models.DecimalField(max_digits=18, decimal_places=4, blank=True, null=True)
    min_length = models.PositiveIntegerField(blank=True, null=True)
    max_length = models.PositiveIntegerField(blank=True, null=True)
    regex = models.CharField(max_length=500, blank=True)
    options = models.JSONField(default=list, blank=True)
    order = models.PositiveSmallIntegerField(default=0)
    is_active = models.BooleanField(default=True)

    class Meta:
        ordering = ("order",)
        constraints = [
            models.UniqueConstraint(fields=("form", "key"), name="unique_form_field_key"),
            models.UniqueConstraint(fields=("form", "order"), name="unique_form_field_order"),
        ]

    def clean(self):
        super().clean()
        option_types = {self.FieldType.SELECT, self.FieldType.MULTI_SELECT, self.FieldType.RADIO}
        if self.field_type in option_types and not self.options:
            raise ValidationError({"options": "Choice fields require at least one option."})
        if self.min_length is not None and self.max_length is not None and self.min_length > self.max_length:
            raise ValidationError("min_length cannot exceed max_length.")


class FormFieldTranslation(UUIDTimestampedModel):
    field = models.ForeignKey(FormField, on_delete=models.CASCADE, related_name="translations")
    locale = models.CharField(max_length=10, choices=LOCALE_CHOICES)
    label = models.CharField(max_length=180)
    placeholder = models.CharField(max_length=220, blank=True)
    help_text = models.TextField(blank=True)
    option_labels = models.JSONField(default=dict, blank=True)

    class Meta:
        constraints = [models.UniqueConstraint(fields=("field", "locale"), name="unique_form_field_locale")]


class FormSubmission(UUIDTimestampedModel):
    class Status(models.TextChoices):
        NEW = "new", "New"
        CONTACTED = "contacted", "Contacted"
        QUALIFIED = "qualified", "Qualified"
        CLOSED = "closed", "Closed"

    form = models.ForeignKey(Form, on_delete=models.PROTECT, related_name="submissions")
    locale = models.CharField(max_length=10, choices=LOCALE_CHOICES)
    data = models.JSONField()
    status = models.CharField(max_length=16, choices=Status.choices, default=Status.NEW, db_index=True)
    source_url = models.URLField(max_length=500, blank=True)
    referrer = models.URLField(max_length=500, blank=True)
    consent_given = models.BooleanField(default=False)
    consent_text = models.TextField(blank=True)
    user_agent = models.CharField(max_length=500, blank=True)
    ip_hash = models.CharField(max_length=64, blank=True, db_index=True)
    expires_at = models.DateTimeField(db_index=True)
    internal_notes = models.TextField(blank=True)

    class Meta:
        ordering = ("-created_at",)
        indexes = [
            models.Index(fields=("form", "-created_at"), name="forms_sub_form_created_idx"),
            models.Index(fields=("locale", "-created_at"), name="forms_sub_locale_created_idx"),
        ]

    def clean(self):
        super().clean()
        if self.form.requires_privacy_consent and not self.consent_given:
            raise ValidationError({"consent_given": "Privacy consent is required."})

    @staticmethod
    def hash_ip(ip_address: str, salt: str) -> str:
        return hashlib.sha256(f"{salt}:{ip_address}".encode()).hexdigest()


def submission_file_path(instance, filename):
    return f"{instance.submission.form.key}/{instance.submission.created_at:%Y/%m}/{instance.submission_id}/{filename}"


class SubmissionFile(UUIDTimestampedModel):
    submission = models.ForeignKey(FormSubmission, on_delete=models.CASCADE, related_name="files")
    file = models.FileField(storage=private_submission_storage, upload_to=submission_file_path, validators=[validate_submission_file])
    original_name = models.CharField(max_length=255)
    mime_type = models.CharField(max_length=120)
    size = models.PositiveBigIntegerField()
    checksum_sha256 = models.CharField(max_length=64)

    class Meta:
        ordering = ("created_at",)
