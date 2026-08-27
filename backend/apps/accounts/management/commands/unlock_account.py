from django.contrib.auth.models import User
from django.core.management.base import BaseCommand, CommandError

from apps.accounts.security import unlock_account


class Command(BaseCommand):
    help = "Clear persistent admin login lockout state for a user."

    def add_arguments(self, parser):
        parser.add_argument("username")

    def handle(self, *args, **options):
        try:
            user = User.objects.get(username=options["username"])
        except User.DoesNotExist as exc:
            raise CommandError("Unknown user.") from exc
        unlock_account(user)
        self.stdout.write(self.style.SUCCESS(f"Unlocked {user.username}."))
