from __future__ import annotations

import json

from apps.content.models import ContentTranslation

from .models import SearchDocument
from .normalization import normalize_search_text


def index_translation(translation: ContentTranslation) -> SearchDocument | None:
    is_public = (
        translation.item.is_active
        and translation.workflow_status == ContentTranslation.WorkflowStatus.PUBLISHED
        and translation.translation_status == ContentTranslation.TranslationStatus.REVIEWED
    )
    if not is_public:
        SearchDocument.objects.filter(translation=translation).delete()
        return None
    block_text = " ".join(
        json.dumps(block.props, ensure_ascii=False) for block in translation.blocks.filter(is_active=True).order_by("order")
    )
    normalized = normalize_search_text(" ".join((translation.title, translation.excerpt, block_text)))
    document, _ = SearchDocument.objects.update_or_create(
        translation=translation,
        defaults={
            "locale": translation.locale,
            "kind": translation.item.kind,
            "title": translation.title,
            "summary": translation.excerpt,
            "normalized_text": normalized,
            "public_path": translation.public_path,
        },
    )
    return document
