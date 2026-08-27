from django import forms
from django.core.exceptions import ValidationError

from .models import ContentBlock, ContentTranslation


WORKFLOW_FIELDS = {"workflow_status", "publish_at", "published_at"}


class ContentTranslationAdminForm(forms.ModelForm):
    class Meta:
        model = ContentTranslation
        fields = "__all__"

    def clean(self):
        cleaned = super().clean()
        if self.instance.pk and self.instance.workflow_status == ContentTranslation.WorkflowStatus.PUBLISHED:
            changed = set(self.changed_data)
            if changed:
                raise ValidationError("Published translations are immutable outside the publication service.")
        if WORKFLOW_FIELDS.intersection(self.changed_data):
            raise ValidationError("Workflow fields are controlled by the publication service.")
        return cleaned


class ContentBlockAdminForm(forms.ModelForm):
    class Meta:
        model = ContentBlock
        fields = "__all__"

    def clean(self):
        cleaned = super().clean()
        translation = cleaned.get("translation")
        if translation is None and self.instance.translation_id:
            translation = self.instance.translation
        if translation and translation.workflow_status == ContentTranslation.WorkflowStatus.PUBLISHED:
            raise ValidationError("Blocks of published translations are immutable.")
        return cleaned
