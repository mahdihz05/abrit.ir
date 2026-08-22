from __future__ import annotations

from django.core.exceptions import ValidationError
from django.db import models

from apps.core.models import LOCALE_CHOICES, UUIDTimestampedModel


class Menu(UUIDTimestampedModel):
    class Location(models.TextChoices):
        HEADER = "header", "Header"
        FOOTER = "footer", "Footer"
        MOBILE = "mobile", "Mobile"

    key = models.SlugField(max_length=80, unique=True)
    location = models.CharField(max_length=20, choices=Location.choices)
    is_active = models.BooleanField(default=True)

    class Meta:
        ordering = ("location", "key")

    def __str__(self):
        return f"{self.get_location_display()}: {self.key}"


class MenuItem(UUIDTimestampedModel):
    menu = models.ForeignKey(Menu, on_delete=models.CASCADE, related_name="items")
    parent = models.ForeignKey("self", blank=True, null=True, on_delete=models.CASCADE, related_name="children")
    internal_target = models.ForeignKey(
        "content.ContentItem", blank=True, null=True, on_delete=models.PROTECT, related_name="menu_items"
    )
    external_url = models.CharField(max_length=500, blank=True, help_text="Absolute URL or a locale-aware site path.")
    icon_key = models.SlugField(max_length=80, blank=True)
    featured_image = models.ForeignKey(
        "media.MediaAsset", blank=True, null=True, on_delete=models.SET_NULL, related_name="menu_features"
    )
    column = models.PositiveSmallIntegerField(default=1)
    order = models.PositiveSmallIntegerField(default=0)
    is_active = models.BooleanField(default=True)
    open_in_new_tab = models.BooleanField(default=False)

    class Meta:
        ordering = ("order", "created_at")
        constraints = [models.UniqueConstraint(fields=("menu", "parent", "order"), name="unique_menu_sibling_order")]

    def clean(self):
        super().clean()
        if self.parent_id and self.parent.menu_id != self.menu_id:
            raise ValidationError({"parent": "Parent and child must belong to the same menu."})
        if bool(self.internal_target_id) == bool(self.external_url):
            raise ValidationError("Choose exactly one internal target or external URL.")
        if self.external_url and not (self.external_url.startswith("/") or self.external_url.startswith("https://")):
            raise ValidationError({"external_url": "Use a site-relative path or an HTTPS URL."})
        if not 1 <= self.column <= 6:
            raise ValidationError({"column": "Mega Menu columns must be between 1 and 6."})

    def __str__(self):
        return f"{self.menu.key} item {self.order}"


class MenuItemTranslation(UUIDTimestampedModel):
    item = models.ForeignKey(MenuItem, on_delete=models.CASCADE, related_name="translations")
    locale = models.CharField(max_length=10, choices=LOCALE_CHOICES)
    title = models.CharField(max_length=120)
    description = models.CharField(max_length=300, blank=True)

    class Meta:
        constraints = [models.UniqueConstraint(fields=("item", "locale"), name="unique_menu_item_locale")]

    def __str__(self):
        return f"{self.title} ({self.locale})"
