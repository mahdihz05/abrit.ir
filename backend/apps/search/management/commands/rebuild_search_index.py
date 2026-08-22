from django.core.management.base import BaseCommand

from apps.content.api import published_content
from apps.search.indexing import index_translation
from apps.search.models import SearchDocument


class Command(BaseCommand):
    help = "Rebuild the public search index from reviewed, published translations."

    def handle(self, *args, **options):
        active_ids = []
        for translation in published_content().prefetch_related("blocks"):
            index_translation(translation)
            active_ids.append(translation.id)
        removed, _ = SearchDocument.objects.exclude(translation_id__in=active_ids).delete()
        self.stdout.write(self.style.SUCCESS(f"Indexed {len(active_ids)} translation(s); removed {removed} stale document(s)."))
