from __future__ import annotations

from django.conf import settings
from django.core.exceptions import ValidationError
from django.db import models

from apps.core.models import LOCALE_CHOICES, UUIDTimestampedModel

from .block_schemas import BLOCK_SCHEMAS, validate_block_props


class ContentItem(UUIDTimestampedModel):
    class Kind(models.TextChoices):
        PAGE = "page", "Page"
        SERVICE = "service", "Service"
        SOLUTION = "solution", "Solution"
        KNOWLEDGE = "knowledge", "Knowledge"
        NEWS = "news", "News & Media"

    key = models.SlugField(max_length=100, unique=True)
    kind = models.CharField(max_length=20, choices=Kind.choices)
    parent = models.ForeignKey("self", blank=True, null=True, on_delete=models.PROTECT, related_name="children")
    template_key = models.SlugField(max_length=80, default="default")
    is_active = models.BooleanField(default=True)

    class Meta:
        ordering = ("kind", "key")
        indexes = [models.Index(fields=("kind", "is_active"))]

    def clean(self):
        super().clean()
        if self.parent_id and self.parent_id == self.id:
            raise ValidationError({"parent": "An item cannot be its own parent."})

    def __str__(self):
        return f"{self.get_kind_display()}: {self.key}"


class ContentTranslation(UUIDTimestampedModel):
    class WorkflowStatus(models.TextChoices):
        DRAFT = "draft", "Draft"
        REVIEW = "review", "Review"
        SCHEDULED = "scheduled", "Scheduled"
        PUBLISHED = "published", "Published"
        ARCHIVED = "archived", "Archived"

    class TranslationStatus(models.TextChoices):
        MISSING = "missing", "Missing"
        DRAFT = "draft", "Draft"
        TRANSLATED = "translated", "Translated"
        REVIEWED = "reviewed", "Reviewed"
        OUTDATED = "outdated", "Outdated"

    item = models.ForeignKey(ContentItem, on_delete=models.CASCADE, related_name="translations")
    locale = models.CharField(max_length=10, choices=LOCALE_CHOICES)
    title = models.CharField(max_length=180)
    slug = models.SlugField(max_length=180, allow_unicode=True)
    path = models.CharField(max_length=500, help_text="Locale-relative public path without a leading slash.")
    excerpt = models.TextField(blank=True)
    workflow_status = models.CharField(max_length=16, choices=WorkflowStatus.choices, default=WorkflowStatus.DRAFT)
    translation_status = models.CharField(max_length=16, choices=TranslationStatus.choices, default=TranslationStatus.DRAFT)
    publish_at = models.DateTimeField(blank=True, null=True)
    published_at = models.DateTimeField(blank=True, null=True)
    source_revision = models.UUIDField(blank=True, null=True)
    seo_title = models.CharField(max_length=70, blank=True)
    seo_description = models.CharField(max_length=170, blank=True)
    canonical_url = models.URLField(blank=True)
    robots_index = models.BooleanField(default=True)
    robots_follow = models.BooleanField(default=True)
    og_title = models.CharField(max_length=100, blank=True)
    og_description = models.CharField(max_length=220, blank=True)
    og_image = models.ForeignKey("media.MediaAsset", blank=True, null=True, on_delete=models.SET_NULL, related_name="open_graph_translations")

    class Meta:
        ordering = ("item", "locale")
        constraints = [
            models.UniqueConstraint(fields=("item", "locale"), name="unique_content_item_locale"),
            models.UniqueConstraint(fields=("locale", "path"), name="unique_public_locale_path"),
        ]
        indexes = [
            models.Index(fields=("locale", "workflow_status", "published_at")),
            models.Index(fields=("locale", "path")),
        ]

    def clean(self):
        super().clean()
        self.path = self.path.strip().strip("/")
        if not self.path and self.item.kind != ContentItem.Kind.PAGE:
            raise ValidationError({"path": "Only a page such as Home may use the locale root path."})
        if self.workflow_status == self.WorkflowStatus.PUBLISHED:
            if self.translation_status != self.TranslationStatus.REVIEWED:
                raise ValidationError({"translation_status": "Only reviewed translations can be published."})
            if not self.published_at:
                raise ValidationError({"published_at": "Published content requires a publication timestamp."})
        if self.workflow_status == self.WorkflowStatus.SCHEDULED and not self.publish_at:
            raise ValidationError({"publish_at": "Scheduled content requires publish_at."})

    @property
    def public_path(self):
        suffix = f"/{self.path}" if self.path else ""
        return f"/{self.locale}{suffix}"

    def __str__(self):
        return f"{self.title} ({self.locale})"


class ContentBlock(UUIDTimestampedModel):
    VARIANT_CHOICES = tuple((value, value.title()) for value in ("default", "simple", "centered", "split", "dashboard", "network", "cards", "bento", "compact"))
    translation = models.ForeignKey(ContentTranslation, on_delete=models.CASCADE, related_name="blocks")
    block_type = models.CharField(max_length=40, choices=tuple((key, key.replace("_", " ").title()) for key in BLOCK_SCHEMAS))
    variant = models.CharField(max_length=30, choices=VARIANT_CHOICES, default="default")
    order = models.PositiveSmallIntegerField(default=0)
    is_active = models.BooleanField(default=True)
    schema_version = models.PositiveSmallIntegerField(default=1)
    props = models.JSONField(default=dict)

    class Meta:
        ordering = ("order", "created_at")
        constraints = [models.UniqueConstraint(fields=("translation", "order"), name="unique_block_order")]

    def clean(self):
        super().clean()
        errors = validate_block_props(self.block_type, self.props)
        if errors:
            raise ValidationError({"props": errors})

    def __str__(self):
        return f"{self.translation}: {self.block_type} #{self.order}"


class ContentRelation(UUIDTimestampedModel):
    class RelationType(models.TextChoices):
        RELATED = "related", "Related"
        SERVICE_SOLUTION = "service_solution", "Service to solution"
        SERVICE_KNOWLEDGE = "service_knowledge", "Service to knowledge"
        NEWS_SERVICE = "news_service", "News to service"

    source = models.ForeignKey(ContentItem, on_delete=models.CASCADE, related_name="outgoing_relations")
    target = models.ForeignKey(ContentItem, on_delete=models.CASCADE, related_name="incoming_relations")
    relation_type = models.CharField(max_length=30, choices=RelationType.choices, default=RelationType.RELATED)
    order = models.PositiveSmallIntegerField(default=0)

    class Meta:
        ordering = ("order",)
        constraints = [models.UniqueConstraint(fields=("source", "target", "relation_type"), name="unique_content_relation")]

    def clean(self):
        super().clean()
        if self.source_id == self.target_id:
            raise ValidationError({"target": "Content cannot relate to itself."})


class Capability(UUIDTimestampedModel):
    key = models.SlugField(max_length=100, unique=True)
    is_active = models.BooleanField(default=True)

    def __str__(self):
        return self.key


class CapabilityTranslation(UUIDTimestampedModel):
    capability = models.ForeignKey(Capability, on_delete=models.CASCADE, related_name="translations")
    locale = models.CharField(max_length=10, choices=LOCALE_CHOICES)
    name = models.CharField(max_length=160)
    description = models.TextField(blank=True)

    class Meta:
        constraints = [models.UniqueConstraint(fields=("capability", "locale"), name="unique_capability_locale")]


class Technology(UUIDTimestampedModel):
    name = models.CharField(max_length=120, unique=True)
    url = models.URLField(blank=True)
    logo = models.ForeignKey("media.MediaAsset", blank=True, null=True, on_delete=models.SET_NULL, related_name="technologies")
    is_active = models.BooleanField(default=True)

    def __str__(self):
        return self.name


class ServiceProfile(UUIDTimestampedModel):
    item = models.OneToOneField(ContentItem, on_delete=models.CASCADE, related_name="service_profile")
    capabilities = models.ManyToManyField(Capability, blank=True, related_name="services")
    technologies = models.ManyToManyField(Technology, blank=True, related_name="services")

    def clean(self):
        super().clean()
        if self.item.kind != ContentItem.Kind.SERVICE:
            raise ValidationError({"item": "A service profile requires a service content item."})


class TaxonomyTerm(UUIDTimestampedModel):
    class Kind(models.TextChoices):
        KNOWLEDGE_CATEGORY = "knowledge_category", "Knowledge category"
        NEWS_CATEGORY = "news_category", "News category"
        TAG = "tag", "Tag"

    key = models.SlugField(max_length=100)
    kind = models.CharField(max_length=30, choices=Kind.choices)

    class Meta:
        constraints = [models.UniqueConstraint(fields=("kind", "key"), name="unique_taxonomy_key")]


class TaxonomyTranslation(UUIDTimestampedModel):
    term = models.ForeignKey(TaxonomyTerm, on_delete=models.CASCADE, related_name="translations")
    locale = models.CharField(max_length=10, choices=LOCALE_CHOICES)
    name = models.CharField(max_length=120)
    slug = models.SlugField(max_length=120, allow_unicode=True)

    class Meta:
        constraints = [models.UniqueConstraint(fields=("term", "locale"), name="unique_taxonomy_locale")]


class ArticleProfile(UUIDTimestampedModel):
    class ArticleType(models.TextChoices):
        KNOWLEDGE = "knowledge", "Knowledge"
        NEWS = "news", "News"
        ARTICLE = "article", "Article"
        PRESS_RELEASE = "press_release", "Press release"
        ANNOUNCEMENT = "announcement", "Announcement"
        EVENT = "event", "Event"
        VIDEO = "video", "Video"
        GALLERY = "gallery", "Gallery"

    item = models.OneToOneField(ContentItem, on_delete=models.CASCADE, related_name="article_profile")
    article_type = models.CharField(max_length=30, choices=ArticleType.choices)
    terms = models.ManyToManyField(TaxonomyTerm, blank=True, related_name="articles")
    event_at = models.DateTimeField(blank=True, null=True)

    def clean(self):
        super().clean()
        if self.item.kind not in (ContentItem.Kind.KNOWLEDGE, ContentItem.Kind.NEWS):
            raise ValidationError({"item": "Article profiles require knowledge or news content."})


class ContentRevision(UUIDTimestampedModel):
    class Source(models.TextChoices):
        ADMIN = "admin", "Admin"
        AGENT = "agent", "Agent"
        MCP = "mcp", "MCP"
        SYSTEM = "system", "System"

    translation = models.ForeignKey(ContentTranslation, on_delete=models.CASCADE, related_name="revisions")
    version = models.PositiveIntegerField()
    snapshot = models.JSONField()
    actor = models.ForeignKey(settings.AUTH_USER_MODEL, blank=True, null=True, on_delete=models.SET_NULL)
    source = models.CharField(max_length=12, choices=Source.choices, default=Source.ADMIN)

    class Meta:
        ordering = ("-version",)
        constraints = [models.UniqueConstraint(fields=("translation", "version"), name="unique_revision_version")]

    def __str__(self):
        return f"{self.translation} v{self.version}"
