from django.core.management.base import BaseCommand
from django.utils import timezone

from apps.content.models import ContentRevision, ContentTranslation
from apps.content.services import publish_translation


class Command(BaseCommand):
    help = "Publish reviewed translations whose scheduled time has arrived. Safe to run from cron."

    def handle(self, *args, **options):
        due_ids = list(
            ContentTranslation.objects.filter(
                workflow_status=ContentTranslation.WorkflowStatus.SCHEDULED,
                translation_status=ContentTranslation.TranslationStatus.REVIEWED,
                publish_at__lte=timezone.now(),
            ).values_list("id", flat=True)
        )
        published = 0
        for translation_id in due_ids:
            translation = ContentTranslation.objects.get(pk=translation_id)
            publish_translation(translation, source=ContentRevision.Source.SYSTEM)
            published += 1
        self.stdout.write(self.style.SUCCESS(f"Published {published} scheduled translation(s)."))
