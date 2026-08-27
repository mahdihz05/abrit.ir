from django.core.management.base import BaseCommand

from apps.accounts.roles import provision_roles


class Command(BaseCommand):
    help = "Reconcile the immutable Phase 1 role groups and their exact permissions."

    def handle(self, *args, **options):
        if not provision_roles():
            self.stderr.write(self.style.WARNING("Required permissions are not all installed; no roles were changed."))
            return
        self.stdout.write(self.style.SUCCESS("Phase 1 roles synchronized."))
