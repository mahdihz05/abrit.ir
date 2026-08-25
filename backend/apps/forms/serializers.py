from __future__ import annotations

import re
from datetime import timedelta
from decimal import Decimal, InvalidOperation

from django.conf import settings
from django.core.validators import URLValidator, validate_email
from django.core.exceptions import ValidationError as DjangoValidationError
from django.utils import timezone
from rest_framework import serializers

from .models import Form, FormField, FormSubmission


PHONE_PATTERN = re.compile(r"^[+0-9][0-9()\-\s]{6,24}$")


class PublicFormSubmissionSerializer(serializers.Serializer):
    locale = serializers.ChoiceField(choices=("fa", "en", "ar-ae"))
    data = serializers.DictField()
    consent_given = serializers.BooleanField()
    source_url = serializers.URLField(max_length=500, required=False, allow_blank=True)
    referrer = serializers.URLField(max_length=500, required=False, allow_blank=True)
    website = serializers.CharField(required=False, allow_blank=True, write_only=True)

    default_error_messages = {
        "inactive": "This form is not available.",
        "required": "This field is required.",
        "invalid": "The submitted value is invalid.",
    }

    def validate(self, attrs):
        form: Form = self.context["form"]
        if not form.is_active:
            self.fail("inactive")
        if attrs.pop("website", "").strip():
            raise serializers.ValidationError({"detail": "The request could not be accepted."})
        if form.requires_privacy_consent and not attrs.get("consent_given"):
            raise serializers.ValidationError({"consent_given": "Privacy consent is required."})

        fields = {field.key: field for field in form.active_fields}
        submitted = attrs.get("data", {})
        unknown = set(submitted) - set(fields)
        if unknown:
            raise serializers.ValidationError({"data": f"Unknown fields: {', '.join(sorted(unknown))}"})

        cleaned = {}
        errors = {}
        for key, field in fields.items():
            value = submitted.get(key)
            if value in (None, "", []):
                if field.required:
                    errors[key] = self.error_messages["required"]
                continue
            try:
                cleaned[key] = self._clean_field(field, value)
            except serializers.ValidationError as exc:
                errors[key] = exc.detail
        if errors:
            raise serializers.ValidationError({"data": errors})
        attrs["data"] = cleaned
        return attrs

    def _clean_field(self, field: FormField, value):
        if field.field_type == FormField.FieldType.MULTI_SELECT:
            if not isinstance(value, list) or any(item not in field.options for item in value):
                raise serializers.ValidationError(self.error_messages["invalid"])
            return value
        if field.field_type == FormField.FieldType.CHECKBOX:
            if not isinstance(value, bool):
                raise serializers.ValidationError(self.error_messages["invalid"])
            return value

        text = str(value).strip()
        if field.min_length is not None and len(text) < field.min_length:
            raise serializers.ValidationError(f"Use at least {field.min_length} characters.")
        if field.max_length is not None and len(text) > field.max_length:
            raise serializers.ValidationError(f"Use no more than {field.max_length} characters.")
        if field.regex and not re.fullmatch(field.regex, text):
            raise serializers.ValidationError(self.error_messages["invalid"])

        if field.field_type == FormField.FieldType.EMAIL:
            try:
                validate_email(text)
            except DjangoValidationError as exc:
                raise serializers.ValidationError(self.error_messages["invalid"]) from exc
        elif field.field_type == FormField.FieldType.PHONE and not PHONE_PATTERN.fullmatch(text):
            raise serializers.ValidationError(self.error_messages["invalid"])
        elif field.field_type == FormField.FieldType.URL:
            try:
                URLValidator()(text)
            except DjangoValidationError as exc:
                raise serializers.ValidationError(self.error_messages["invalid"]) from exc
        elif field.field_type == FormField.FieldType.NUMBER:
            try:
                number = Decimal(text)
            except InvalidOperation as exc:
                raise serializers.ValidationError(self.error_messages["invalid"]) from exc
            if field.min_value is not None and number < field.min_value:
                raise serializers.ValidationError(f"Minimum value is {field.min_value}.")
            if field.max_value is not None and number > field.max_value:
                raise serializers.ValidationError(f"Maximum value is {field.max_value}.")
            return str(number)
        elif field.field_type in {FormField.FieldType.SELECT, FormField.FieldType.RADIO} and text not in field.options:
            raise serializers.ValidationError(self.error_messages["invalid"])
        return text

    def create(self, validated_data):
        request = self.context["request"]
        form: Form = self.context["form"]
        translation = next(
            (item for item in form.translations.all() if item.locale == validated_data["locale"]),
            None,
        )
        remote_ip = request.META.get("REMOTE_ADDR", "")
        salt = settings.SECRET_KEY or "abrit-form-submission"
        return FormSubmission.objects.create(
            form=form,
            locale=validated_data["locale"],
            data=validated_data["data"],
            source_url=validated_data.get("source_url", ""),
            referrer=validated_data.get("referrer", ""),
            consent_given=validated_data["consent_given"],
            consent_text=translation.consent_label if translation else "",
            user_agent=request.META.get("HTTP_USER_AGENT", "")[:500],
            ip_hash=FormSubmission.hash_ip(remote_ip, salt) if remote_ip else "",
            expires_at=timezone.now() + timedelta(days=form.retention_months * 30),
        )
