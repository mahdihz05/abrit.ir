from datetime import timedelta

import pytest
from django.contrib.auth.models import Permission, User
from django.utils import timezone
from rest_framework.test import APIClient

from apps.accounts.models import AccountSecurity
from apps.content.models import ContentItem, ContentTranslation
from apps.forms.models import Form, FormSubmission

from .models import RevalidationEvent
from apps.content.workflow import workflow_transition
from apps.accounts.roles import assign_fixed_role, provision_roles


@pytest.fixture
def dashboard_client():
    provision_roles()
    user = User.objects.create_user("dashboard", password="password")
    assign_fixed_role(user, "editor")
    client = APIClient()
    client.force_authenticate(user=user)
    return client


@pytest.mark.django_db
def test_dashboard_returns_fixed_aggregate(dashboard_client):
    active = User.objects.create_user("active", password="password")
    locked = User.objects.create_user("locked", password="password")
    AccountSecurity.objects.create(user=locked, locked_until=timezone.now() + timedelta(minutes=5))
    User.objects.create_user("inactive", password="password", is_active=False)

    for index, status in enumerate(ContentTranslation.WorkflowStatus.values):
        item = ContentItem.objects.create(key=f"dashboard-page-{index}", kind=ContentItem.Kind.PAGE)
        with workflow_transition():
            ContentTranslation.objects.create(
                item=item,
                locale=("fa" if index == 0 else "en" if index == 1 else "ar-ae"),
                title=f"Status {status}",
                slug=f"dashboard-{status}",
                path=f"dashboard-{status}-{index}",
                workflow_status=status,
                translation_status=ContentTranslation.TranslationStatus.REVIEWED if status == "published" else ContentTranslation.TranslationStatus.DRAFT,
                published_at=timezone.now() if status == "published" else None,
                publish_at=timezone.now() if status == "scheduled" else None,
            )
    form = Form.objects.create(key="dashboard-form")
    FormSubmission.objects.create(
        form=form, locale="fa", data={}, consent_given=True,
        expires_at=timezone.now() + timedelta(days=1),
    )
    RevalidationEvent.objects.create(status=RevalidationEvent.Status.PENDING)
    RevalidationEvent.objects.create(status=RevalidationEvent.Status.FAILED)

    response = dashboard_client.get("/api/v1/admin/dashboard")

    assert response.status_code == 200
    data = response.json()["data"]
    assert data["users"] == {"total": 4, "active": 3, "locked": 1}
    assert data["content"] == {"draft": 1, "review": 1, "scheduled": 1, "published": 1, "archived": 1}
    assert data["submissions"] == {"new": 1}
    assert data["revalidation"] == {"pending": 1, "failed": 1}
    assert data["generated_at"]
    assert active.is_active


@pytest.mark.django_db
def test_dashboard_requires_authenticated_admin_session():
    response = APIClient().get("/api/v1/admin/dashboard")
    assert response.status_code == 401
    assert response.json() == {
        "error": {"status": 401, "code": "session_expired", "detail": "Your admin session has expired."}
    }


@pytest.mark.django_db
def test_dashboard_requires_view_permission():
    user = User.objects.create_user("without-dashboard", password="password")
    client = APIClient()
    client.force_authenticate(user=user)

    response = client.get("/api/v1/admin/dashboard")

    assert response.status_code == 403
    assert response.json() == {
        "error": {"status": 403, "code": "permission_denied", "detail": "You are not allowed to access the administration API."}
    }


@pytest.mark.django_db
def test_dashboard_does_not_accept_writes():
    user = User.objects.create_superuser("root", password="password")
    client = APIClient()
    client.force_authenticate(user=user)

    response = client.post("/api/v1/admin/dashboard", {})

    assert response.status_code == 405
