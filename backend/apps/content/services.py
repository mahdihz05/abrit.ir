from __future__ import annotations

from typing import Any

from django.db import transaction
from django.db.models import Max
from django.utils import timezone
from django.utils.dateparse import parse_datetime

from apps.core.models import AuditLog, RevalidationEvent

from .models import ContentBlock, ContentRevision, ContentTranslation


def translation_snapshot(translation: ContentTranslation) -> dict[str, Any]:
    return {
        "translation": {
            "title": translation.title,
            "slug": translation.slug,
            "path": translation.path,
            "excerpt": translation.excerpt,
            "workflow_status": translation.workflow_status,
            "translation_status": translation.translation_status,
            "publish_at": translation.publish_at.isoformat() if translation.publish_at else None,
            "published_at": translation.published_at.isoformat() if translation.published_at else None,
            "seo_title": translation.seo_title,
            "seo_description": translation.seo_description,
            "canonical_url": translation.canonical_url,
            "robots_index": translation.robots_index,
            "robots_follow": translation.robots_follow,
            "og_title": translation.og_title,
            "og_description": translation.og_description,
            "og_image_id": str(translation.og_image_id) if translation.og_image_id else None,
        },
        "blocks": [
            {
                "id": str(block.id),
                "block_type": block.block_type,
                "variant": block.variant,
                "order": block.order,
                "is_active": block.is_active,
                "schema_version": block.schema_version,
                "props": block.props,
            }
            for block in translation.blocks.order_by("order")
        ],
    }


def create_revision(translation: ContentTranslation, *, actor=None, source=ContentRevision.Source.ADMIN):
    latest = translation.revisions.aggregate(latest=Max("version"))["latest"] or 0
    return ContentRevision.objects.create(
        translation=translation,
        version=latest + 1,
        snapshot=translation_snapshot(translation),
        actor=actor,
        source=source,
    )


@transaction.atomic
def publish_translation(translation: ContentTranslation, *, actor=None, source=ContentRevision.Source.ADMIN):
    translation = ContentTranslation.objects.select_for_update().select_related("item").get(pk=translation.pk)
    before = translation_snapshot(translation)
    translation.workflow_status = ContentTranslation.WorkflowStatus.PUBLISHED
    translation.published_at = timezone.now()
    translation.full_clean()
    translation.save(update_fields=("workflow_status", "published_at", "updated_at"))
    create_revision(translation, actor=actor, source=source)
    from apps.search.indexing import index_translation
    index_translation(translation)
    _audit_and_revalidate(translation, actor=actor, source=source, action="publish", before=before)
    return translation


@transaction.atomic
def unpublish_translation(translation: ContentTranslation, *, actor=None, source=ContentRevision.Source.ADMIN):
    translation = ContentTranslation.objects.select_for_update().select_related("item").get(pk=translation.pk)
    before = translation_snapshot(translation)
    translation.workflow_status = ContentTranslation.WorkflowStatus.DRAFT
    translation.save(update_fields=("workflow_status", "updated_at"))
    from apps.search.indexing import index_translation
    index_translation(translation)
    create_revision(translation, actor=actor, source=source)
    _audit_and_revalidate(translation, actor=actor, source=source, action="unpublish", before=before)
    return translation


@transaction.atomic
def restore_revision(revision: ContentRevision, *, actor=None, source=ContentRevision.Source.ADMIN):
    translation = ContentTranslation.objects.select_for_update().select_related("item").get(pk=revision.translation_id)
    before = translation_snapshot(translation)
    values = revision.snapshot["translation"]
    for field in (
        "title", "slug", "path", "excerpt", "workflow_status", "translation_status", "seo_title",
        "seo_description", "canonical_url", "robots_index", "robots_follow", "og_title", "og_description",
    ):
        setattr(translation, field, values[field])
    translation.publish_at = parse_datetime(values["publish_at"]) if values.get("publish_at") else None
    translation.published_at = parse_datetime(values["published_at"]) if values.get("published_at") else None
    translation.og_image_id = values.get("og_image_id")
    translation.full_clean()
    translation.save()

    restored_ids = []
    for block_values in revision.snapshot.get("blocks", []):
        block_id = block_values["id"]
        block, _ = ContentBlock.objects.update_or_create(
            id=block_id,
            translation=translation,
            defaults={key: block_values[key] for key in ("block_type", "variant", "order", "is_active", "schema_version", "props")},
        )
        block.full_clean()
        block.save()
        restored_ids.append(block.id)
    translation.blocks.exclude(id__in=restored_ids).delete()
    from apps.search.indexing import index_translation
    index_translation(translation)
    create_revision(translation, actor=actor, source=source)
    _audit_and_revalidate(translation, actor=actor, source=source, action="restore", before=before)
    return translation


def _audit_and_revalidate(translation, *, actor, source, action, before):
    AuditLog.objects.create(
        actor=actor,
        actor_type=source,
        action=action,
        object_type="content_translation",
        object_id=str(translation.id),
        before=before,
        after=translation_snapshot(translation),
    )
    RevalidationEvent.objects.create(
        tags=[f"content:{translation.item.key}", f"kind:{translation.item.kind}", f"locale:{translation.locale}"],
        paths=[translation.public_path],
    )
