from __future__ import annotations

from django.core.exceptions import ValidationError
from django.core.validators import MaxValueValidator
from django.db import models

from apps.core.models import LOCALE_CHOICES, UUIDTimestampedModel


class Package(UUIDTimestampedModel):
    key = models.SlugField(max_length=80, unique=True)
    order = models.PositiveSmallIntegerField(unique=True)
    base_monthly_toman = models.PositiveBigIntegerField()
    included_users = models.PositiveIntegerField()
    included_endpoints = models.PositiveIntegerField()
    included_servers = models.PositiveIntegerField(default=0)
    included_sites = models.PositiveIntegerField(default=1)
    currency = models.CharField(max_length=3, default="IRT", editable=False)
    is_featured = models.BooleanField(default=False)
    is_active = models.BooleanField(default=True)

    class Meta:
        ordering = ("order",)

    def __str__(self):
        return self.key


class PackageTranslation(UUIDTimestampedModel):
    package = models.ForeignKey(Package, on_delete=models.CASCADE, related_name="translations")
    locale = models.CharField(max_length=10, choices=LOCALE_CHOICES)
    name = models.CharField(max_length=120)
    audience = models.CharField(max_length=220, blank=True)
    description = models.TextField(blank=True)
    sla_text = models.CharField(max_length=220)
    cta_label = models.CharField(max_length=100, blank=True)

    class Meta:
        constraints = [models.UniqueConstraint(fields=("package", "locale"), name="unique_package_locale")]

    def __str__(self):
        return f"{self.name} ({self.locale})"


class PackageFeature(UUIDTimestampedModel):
    key = models.SlugField(max_length=100, unique=True)
    order = models.PositiveSmallIntegerField(default=0)

    class Meta:
        ordering = ("order", "key")


class PackageFeatureTranslation(UUIDTimestampedModel):
    feature = models.ForeignKey(PackageFeature, on_delete=models.CASCADE, related_name="translations")
    locale = models.CharField(max_length=10, choices=LOCALE_CHOICES)
    name = models.CharField(max_length=160)
    description = models.TextField(blank=True)

    class Meta:
        constraints = [models.UniqueConstraint(fields=("feature", "locale"), name="unique_feature_locale")]


class PackageFeatureValue(UUIDTimestampedModel):
    package = models.ForeignKey(Package, on_delete=models.CASCADE, related_name="feature_values")
    feature = models.ForeignKey(PackageFeature, on_delete=models.CASCADE, related_name="package_values")
    value = models.CharField(max_length=220)
    is_included = models.BooleanField(default=True)

    class Meta:
        constraints = [models.UniqueConstraint(fields=("package", "feature"), name="unique_package_feature")]


class AddonRate(UUIDTimestampedModel):
    class AddonType(models.TextChoices):
        USER = "user", "Extra user"
        ENDPOINT = "endpoint", "Extra endpoint"

    package = models.ForeignKey(Package, on_delete=models.CASCADE, related_name="addon_rates")
    addon_type = models.CharField(max_length=20, choices=AddonType.choices)
    monthly_toman = models.PositiveBigIntegerField()

    class Meta:
        constraints = [models.UniqueConstraint(fields=("package", "addon_type"), name="unique_package_addon")]


class ContractTerm(UUIDTimestampedModel):
    months = models.PositiveSmallIntegerField(unique=True)
    discount_bps = models.PositiveSmallIntegerField(validators=[MaxValueValidator(10000)])
    onboarding_bps = models.PositiveSmallIntegerField(validators=[MaxValueValidator(10000)])
    is_active = models.BooleanField(default=True)

    class Meta:
        ordering = ("months",)

    def clean(self):
        super().clean()
        if self.months not in (3, 6, 12):
            raise ValidationError({"months": "Version one supports 3, 6 or 12-month terms."})

    def __str__(self):
        return f"{self.months} months"
