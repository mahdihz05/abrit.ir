from django.core.management.base import BaseCommand
from django.db import transaction
from django.utils import timezone

from apps.core.models import AuditLog
from apps.forms.models import FormSubmission


class Command(BaseCommand):
    help = "Permanently purge expired form submissions and their private files. Safe to run daily from cron."

    def handle(self, *args, **options):
        submission_ids = list(FormSubmission.objects.filter(expires_at__lte=timezone.now()).values_list("id", flat=True))
        deleted_files = 0
        for submission_id in submission_ids:
            with transaction.atomic():
                submission = FormSubmission.objects.select_for_update().get(pk=submission_id)
                files = list(submission.files.all())
                for stored_file in files:
                    if stored_file.file.name:
                        stored_file.file.storage.delete(stored_file.file.name)
                        deleted_files += 1
                AuditLog.objects.create(
                    actor_type="system", action="retention_purge", object_type="form_submission",
                    object_id=str(submission.id), before={"form": submission.form.key, "files": len(files)}, after={},
                )
                submission.delete()
        self.stdout.write(self.style.SUCCESS(f"Purged {len(submission_ids)} submission(s) and {deleted_files} private file(s)."))
