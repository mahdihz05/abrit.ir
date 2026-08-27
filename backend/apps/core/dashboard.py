from __future__ import annotations

from django.contrib.auth.models import User
from django.db.models import Count, Q
from django.utils import timezone

from apps.content.models import ContentTranslation
from apps.forms.models import FormSubmission

from .models import RevalidationEvent


def dashboard_summary(*, now=None) -> dict:
    """Build the fixed dashboard summary using bounded aggregate queries."""
    now = now or timezone.now()
    users = User.objects.aggregate(
        total=Count("pk"),
        active=Count("pk", filter=Q(is_active=True)),
        locked=Count("pk", filter=Q(security__locked_until__gt=now)),
    )
    content = ContentTranslation.objects.aggregate(
        draft=Count("pk", filter=Q(workflow_status=ContentTranslation.WorkflowStatus.DRAFT)),
        review=Count("pk", filter=Q(workflow_status=ContentTranslation.WorkflowStatus.REVIEW)),
        scheduled=Count("pk", filter=Q(workflow_status=ContentTranslation.WorkflowStatus.SCHEDULED)),
        published=Count("pk", filter=Q(workflow_status=ContentTranslation.WorkflowStatus.PUBLISHED)),
        archived=Count("pk", filter=Q(workflow_status=ContentTranslation.WorkflowStatus.ARCHIVED)),
    )
    submissions = FormSubmission.objects.aggregate(
        new=Count("pk", filter=Q(status=FormSubmission.Status.NEW)),
    )
    revalidation = RevalidationEvent.objects.aggregate(
        pending=Count("pk", filter=Q(status=RevalidationEvent.Status.PENDING)),
        failed=Count("pk", filter=Q(status=RevalidationEvent.Status.FAILED)),
    )
    return {
        "generated_at": now,
        "users": {
            "total": users["total"],
            "active": users["active"],
            "locked": users["locked"],
        },
        "content": {
            "draft": content["draft"],
            "review": content["review"],
            "scheduled": content["scheduled"],
            "published": content["published"],
            "archived": content["archived"],
        },
        "submissions": {
            "new": submissions["new"],
        },
        "revalidation": {
            "pending": revalidation["pending"],
            "failed": revalidation["failed"],
        },
    }
