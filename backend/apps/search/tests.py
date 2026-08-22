import pytest

from apps.content.models import ContentItem, ContentTranslation
from apps.content.services import publish_translation, unpublish_translation

from .models import SearchDocument
from .normalization import normalize_search_text


def test_persian_and_arabic_letters_are_normalized_consistently():
    assert normalize_search_text("ي ك إ") == normalize_search_text("ی ک ا")


@pytest.mark.django_db
def test_publish_indexes_and_unpublish_removes_public_document():
    item = ContentItem.objects.create(key="searchable", kind=ContentItem.Kind.PAGE)
    translation = ContentTranslation.objects.create(
        item=item, locale="en", title="Searchable service", slug="searchable", path="searchable",
        translation_status=ContentTranslation.TranslationStatus.REVIEWED,
    )
    publish_translation(translation)
    assert SearchDocument.objects.filter(translation=translation, normalized_text__contains="searchable").exists()
    unpublish_translation(translation)
    assert not SearchDocument.objects.filter(translation=translation).exists()
