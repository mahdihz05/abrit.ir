from __future__ import annotations

import uuid

from django.conf import settings
from django.core.exceptions import ValidationError
from django.core.validators import RegexValidator
from django.db import models


LOCALE_CHOICES = (("fa", "فارسی"), ("en", "English"), ("ar-ae", "العربية"))
hex_color = RegexValidator(r"^#[0-9a-fA-F]{6}$", "Use a six-digit hexadecimal color.")


class UUIDTimestampedModel(models.Model):
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        abstract = True


class SingletonModel(models.Model):
    singleton_key = models.PositiveSmallIntegerField(default=1, unique=True, editable=False)

    class Meta:
        abstract = True

    def clean(self):
        super().clean()
        if self.singleton_key != 1:
            raise ValidationError({"singleton_key": "Only the singleton key 1 is allowed."})

    def save(self, *args, **kwargs):
        self.singleton_key = 1
        self.full_clean()
        return super().save(*args, **kwargs)


class SiteSettings(SingletonModel, UUIDTimestampedModel):
    brand_name = models.CharField(max_length=80, default="AbrIT")
    logo = models.ForeignKey(
        "media.MediaAsset", blank=True, null=True, on_delete=models.SET_NULL, related_name="site_logos"
    )
    favicon = models.ForeignKey(
        "media.MediaAsset", blank=True, null=True, on_delete=models.SET_NULL, related_name="site_favicons"
    )
    phone = models.CharField(max_length=40, default="05131881000")
    email = models.EmailField(blank=True)
    default_locale = models.CharField(max_length=10, choices=LOCALE_CHOICES, default="fa")
    customer_portal_url = models.URLField(blank=True)
    external_checkout_url = models.URLField(blank=True)
    social_links = models.JSONField(default=dict, blank=True)

    class Meta:
        verbose_name_plural = "site settings"

    def __str__(self):
        return self.brand_name


class SiteSettingsTranslation(UUIDTimestampedModel):
    settings = models.ForeignKey(SiteSettings, on_delete=models.CASCADE, related_name="translations")
    locale = models.CharField(max_length=10, choices=LOCALE_CHOICES)
    address = models.CharField(max_length=255, blank=True)
    location_label = models.CharField(max_length=120, blank=True)
    default_seo_title = models.CharField(max_length=70, blank=True)
    default_seo_description = models.CharField(max_length=170, blank=True)

    class Meta:
        constraints = [models.UniqueConstraint(fields=("settings", "locale"), name="unique_site_locale")]

    def __str__(self):
        return f"{self.settings.brand_name} ({self.locale})"


class DesignSettings(SingletonModel, UUIDTimestampedModel):
    primary = models.CharField(max_length=7, default="#2f6bff", validators=[hex_color])
    secondary = models.CharField(max_length=7, default="#0b1023", validators=[hex_color])
    accent = models.CharField(max_length=7, default="#31a9de", validators=[hex_color])
    background = models.CharField(max_length=7, default="#ffffff", validators=[hex_color])
    surface = models.CharField(max_length=7, default="#f4f8ff", validators=[hex_color])
    foreground = models.CharField(max_length=7, default="#172039", validators=[hex_color])
    muted = models.CharField(max_length=7, default="#667085", validators=[hex_color])
    radius_small = models.PositiveSmallIntegerField(default=8)
    radius_medium = models.PositiveSmallIntegerField(default=12)
    radius_large = models.PositiveSmallIntegerField(default=20)
    container_width = models.PositiveSmallIntegerField(default=1180)
    section_spacing = models.PositiveSmallIntegerField(default=96)
    motion_enabled = models.BooleanField(default=True)

    class Meta:
        verbose_name_plural = "design settings"

    def clean(self):
        super().clean()
        if not 960 <= self.container_width <= 1600:
            raise ValidationError({"container_width": "Container width must be between 960 and 1600px."})
        if not 48 <= self.section_spacing <= 160:
            raise ValidationError({"section_spacing": "Section spacing must be between 48 and 160px."})

    def __str__(self):
        return "AbrIT design tokens"


class AuditLog(models.Model):
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    actor = models.ForeignKey(settings.AUTH_USER_MODEL, blank=True, null=True, on_delete=models.SET_NULL)
    actor_type = models.CharField(max_length=20, default="admin")
    action = models.CharField(max_length=80)
    object_type = models.CharField(max_length=120)
    object_id = models.CharField(max_length=64)
    before = models.JSONField(default=dict, blank=True)
    after = models.JSONField(default=dict, blank=True)
    timestamp = models.DateTimeField(auto_now_add=True)

    class Meta:
        ordering = ("-timestamp",)
        indexes = [models.Index(fields=("object_type", "object_id")), models.Index(fields=("-timestamp",))]

    def __str__(self):
        return f"{self.action}: {self.object_type}/{self.object_id}"


class RevalidationEvent(UUIDTimestampedModel):
    class Status(models.TextChoices):
        PENDING = "pending", "Pending"
        SENT = "sent", "Sent"
        FAILED = "failed", "Failed"

    tags = models.JSONField(default=list)
    paths = models.JSONField(default=list)
    status = models.CharField(max_length=12, choices=Status.choices, default=Status.PENDING)
    attempts = models.PositiveSmallIntegerField(default=0)
    last_error = models.TextField(blank=True)
    sent_at = models.DateTimeField(blank=True, null=True)

    class Meta:
        ordering = ("created_at",)
        indexes = [models.Index(fields=("status", "created_at"))]
