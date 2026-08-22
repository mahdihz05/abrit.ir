from __future__ import annotations

from django.core.exceptions import ValidationError
from django.db import models

from apps.core.models import LOCALE_CHOICES, UUIDTimestampedModel


def public_media_upload_to(instance, filename):
    return f"library/{instance.created_at:%Y/%m}" if instance.created_at else f"library/pending/{filename}"


class MediaAsset(UUIDTimestampedModel):
    class MediaType(models.TextChoices):
        IMAGE = "image", "Image"
        VIDEO = "video", "Video"
        DOCUMENT = "document", "Document"
        FILE = "file", "File"

    file = models.FileField(upload_to="library/%Y/%m/")
    media_type = models.CharField(max_length=20, choices=MediaType.choices)
    mime_type = models.CharField(max_length=120)
    size = models.PositiveBigIntegerField()
    width = models.PositiveIntegerField(blank=True, null=True)
    height = models.PositiveIntegerField(blank=True, null=True)
    checksum_sha256 = models.CharField(max_length=64, blank=True, db_index=True)
    is_public = models.BooleanField(default=True)

    class Meta:
        ordering = ("-created_at",)
        indexes = [models.Index(fields=("media_type", "is_public"))]

    def clean(self):
        super().clean()
        if self.media_type == self.MediaType.IMAGE and (not self.width or not self.height):
            raise ValidationError("Image assets require width and height metadata.")

    def __str__(self):
        return self.file.name


class MediaAssetTranslation(UUIDTimestampedModel):
    asset = models.ForeignKey(MediaAsset, on_delete=models.CASCADE, related_name="translations")
    locale = models.CharField(max_length=10, choices=LOCALE_CHOICES)
    title = models.CharField(max_length=180, blank=True)
    alt = models.CharField(max_length=300, blank=True)
    caption = models.TextField(blank=True)

    class Meta:
        constraints = [models.UniqueConstraint(fields=("asset", "locale"), name="unique_media_locale")]

    def clean(self):
        super().clean()
        if self.asset.media_type == MediaAsset.MediaType.IMAGE and self.asset.is_public and not self.alt.strip():
            raise ValidationError({"alt": "Public images require locale-aware alternative text."})

    def __str__(self):
        return f"{self.asset} ({self.locale})"
