from __future__ import annotations

from django.db import models

from apps.core.models import LOCALE_CHOICES, UUIDTimestampedModel


class SearchDocument(UUIDTimestampedModel):
    translation = models.OneToOneField(
        "content.ContentTranslation", on_delete=models.CASCADE, related_name="search_document"
    )
    locale = models.CharField(max_length=10, choices=LOCALE_CHOICES)
    kind = models.CharField(max_length=20)
    title = models.CharField(max_length=180)
    summary = models.TextField(blank=True)
    normalized_text = models.TextField()
    public_path = models.CharField(max_length=500)

    class Meta:
        ordering = ("kind", "title")
        indexes = [models.Index(fields=("locale", "kind")), models.Index(fields=("locale", "title"))]

    def __str__(self):
        return f"{self.title} ({self.locale})"
