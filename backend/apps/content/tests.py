from datetime import timedelta

import pytest
from django.core.management import call_command
from django.core.exceptions import ValidationError
from django.utils import timezone
from rest_framework.test import APIClient

from apps.core.models import RevalidationEvent

from .models import ContentBlock, ContentItem, ContentRevision, ContentTranslation
from .services import publish_translation, restore_revision


@pytest.mark.django_db
def test_only_reviewed_translation_can_publish():
    item = ContentItem.objects.create(key="test", kind=ContentItem.Kind.PAGE)
    translation = ContentTranslation.objects.create(item=item, locale="fa", title="آزمایش", slug="test", path="test")
    with pytest.raises(ValidationError):
        publish_translation(translation)


@pytest.mark.django_db
def test_publish_creates_revision_and_revalidation_event():
    item = ContentItem.objects.create(key="reviewed", kind=ContentItem.Kind.PAGE)
    translation = ContentTranslation.objects.create(
        item=item,
        locale="fa",
        title="بررسی‌شده",
        slug="reviewed",
        path="reviewed",
        translation_status=ContentTranslation.TranslationStatus.REVIEWED,
    )
    publish_translation(translation)
    assert ContentRevision.objects.filter(translation=translation, version=1).exists()
    assert RevalidationEvent.objects.filter(paths=["/fa/reviewed"]).exists()


@pytest.mark.django_db
def test_block_props_are_schema_validated():
    item = ContentItem.objects.create(key="blocks", kind=ContentItem.Kind.PAGE)
    translation = ContentTranslation.objects.create(item=item, locale="fa", title="بلوک", slug="blocks", path="blocks")
    block = ContentBlock(translation=translation, block_type="hero", order=0, props={})
    with pytest.raises(ValidationError):
        block.full_clean()


@pytest.mark.django_db
def test_missing_locale_never_falls_back():
    item = ContentItem.objects.create(key="fa-only", kind=ContentItem.Kind.PAGE)
    ContentTranslation.objects.create(
        item=item,
        locale="fa",
        title="فقط فارسی",
        slug="fa-only",
        path="fa-only",
        workflow_status=ContentTranslation.WorkflowStatus.PUBLISHED,
        translation_status=ContentTranslation.TranslationStatus.REVIEWED,
        published_at=timezone.now(),
    )
    response = APIClient().get("/api/v1/content/en/fa-only")
    assert response.status_code == 404


@pytest.mark.django_db
def test_detail_alternates_only_include_published_reviewed_translations():
    item = ContentItem.objects.create(key="alternates", kind=ContentItem.Kind.PAGE)
    now = timezone.now()
    ContentTranslation.objects.create(
        item=item, locale="en", title="Alternates", slug="alternates", path="alternates",
        workflow_status=ContentTranslation.WorkflowStatus.PUBLISHED,
        translation_status=ContentTranslation.TranslationStatus.REVIEWED,
        published_at=now,
    )
    ContentTranslation.objects.create(
        item=item, locale="fa", title="Draft", slug="alternates-fa", path="alternates-fa",
        workflow_status=ContentTranslation.WorkflowStatus.DRAFT,
        translation_status=ContentTranslation.TranslationStatus.REVIEWED,
    )

    response = APIClient().get("/api/v1/content/en/alternates")
    assert response.status_code == 200
    assert response.json()["data"]["alternates"] == [{"locale": "en", "url": "/en/alternates"}]


@pytest.mark.django_db
def test_revision_can_be_restored_with_a_new_audit_revision():
    item = ContentItem.objects.create(key="restore", kind=ContentItem.Kind.PAGE)
    translation = ContentTranslation.objects.create(
        item=item, locale="en", title="Original", slug="restore", path="restore",
        translation_status=ContentTranslation.TranslationStatus.REVIEWED,
    )
    publish_translation(translation)
    revision = translation.revisions.get(version=1)
    translation.title = "Changed"
    translation.save(update_fields=("title", "updated_at"))
    restore_revision(revision)
    translation.refresh_from_db()
    assert translation.title == "Original"
    assert translation.revisions.count() == 2
    assert RevalidationEvent.objects.filter(paths=["/en/restore"]).count() == 2


@pytest.mark.django_db
def test_due_reviewed_content_is_published_by_command():
    item = ContentItem.objects.create(key="scheduled", kind=ContentItem.Kind.PAGE)
    translation = ContentTranslation.objects.create(
        item=item, locale="en", title="Scheduled", slug="scheduled", path="scheduled",
        workflow_status=ContentTranslation.WorkflowStatus.SCHEDULED,
        translation_status=ContentTranslation.TranslationStatus.REVIEWED,
        publish_at=timezone.now() - timedelta(minutes=1),
    )
    call_command("publish_scheduled")
    translation.refresh_from_db()
    assert translation.workflow_status == ContentTranslation.WorkflowStatus.PUBLISHED
    assert translation.published_at is not None
