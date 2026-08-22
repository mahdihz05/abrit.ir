import hashlib
import hmac
import json
import time
from urllib.error import HTTPError, URLError
from urllib.request import Request, urlopen

from django.conf import settings
from django.core.management.base import BaseCommand, CommandError
from django.db import transaction
from django.utils import timezone

from apps.core.models import RevalidationEvent


class Command(BaseCommand):
    help = "Deliver pending frontend revalidation events. Safe to run from cron."

    def add_arguments(self, parser):
        parser.add_argument("--limit", type=int, default=25)

    def handle(self, *args, **options):
        if not settings.NEXT_REVALIDATION_SECRET:
            raise CommandError("NEXT_REVALIDATION_SECRET is required.")
        ids = list(
            RevalidationEvent.objects.filter(status__in=(RevalidationEvent.Status.PENDING, RevalidationEvent.Status.FAILED))
            .order_by("created_at").values_list("id", flat=True)[: max(1, min(options["limit"], 100))]
        )
        sent = 0
        for event_id in ids:
            with transaction.atomic():
                event = RevalidationEvent.objects.select_for_update().get(pk=event_id)
                body = json.dumps({"tags": event.tags, "paths": event.paths}, separators=(",", ":")).encode()
                timestamp = str(int(time.time()))
                signature = hmac.new(
                    settings.NEXT_REVALIDATION_SECRET.encode(), timestamp.encode() + b"." + body, hashlib.sha256
                ).hexdigest()
                request = Request(
                    settings.NEXT_REVALIDATION_URL,
                    data=body,
                    headers={"Content-Type": "application/json", "X-AbrIT-Timestamp": timestamp, "X-AbrIT-Signature": signature},
                    method="POST",
                )
                event.attempts += 1
                try:
                    with urlopen(request, timeout=10) as response:
                        if response.status != 200:
                            raise URLError(f"Unexpected HTTP status {response.status}")
                    event.status = RevalidationEvent.Status.SENT
                    event.sent_at = timezone.now()
                    event.last_error = ""
                    sent += 1
                except (HTTPError, URLError, TimeoutError) as exc:
                    event.status = RevalidationEvent.Status.FAILED
                    event.last_error = str(exc)[:1000]
                event.save(update_fields=("attempts", "status", "sent_at", "last_error", "updated_at"))
        self.stdout.write(self.style.SUCCESS(f"Delivered {sent} of {len(ids)} revalidation event(s)."))
