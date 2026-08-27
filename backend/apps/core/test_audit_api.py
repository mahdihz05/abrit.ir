import pytest
from django.contrib.auth.models import User
from django.test import Client

from apps.accounts.roles import assign_fixed_role, provision_roles

from .audit import AuditAction, AuditActorType, REDACTED_VALUE, write_audit_log


@pytest.fixture
def audit_client(db):
    provision_roles()
    user = User.objects.create_superuser("audit-root")
    client = Client()
    client.force_login(user)
    return client


@pytest.mark.django_db
def test_audit_api_requires_session_and_view_permission():
    assert Client().get("/api/v1/admin/audit").json() == {
        "error": {"status": 401, "code": "session_expired", "detail": "Your admin session has expired."}
    }
    provision_roles()
    user = User.objects.create_user("editor")
    assign_fixed_role(user, "editor")
    client = Client()
    client.force_login(user)
    response = client.get("/api/v1/admin/audit")
    assert response.status_code == 403
    assert response.json()["error"]["code"] == "permission_denied"


@pytest.mark.django_db
def test_audit_list_combines_filters_and_paginates_deterministically(audit_client):
    first = write_audit_log(action=AuditAction.USER_CREATE, object_type="user", object_id="1", actor_type=AuditActorType.ADMIN)
    second = write_audit_log(action=AuditAction.USER_UPDATE, object_type="user", object_id="2", actor_type=AuditActorType.SYSTEM)
    response = audit_client.get("/api/v1/admin/audit?page=1&page_size=1&actor_type=admin&action=user_create&object_type=user&object_id=1")
    assert response.status_code == 200
    assert response.json()["meta"] == {"page": 1, "page_size": 1, "total": 1, "total_pages": 1}
    assert response.json()["data"][0]["id"] == str(first.id)
    assert set(response.json()["data"][0]) == {"id", "timestamp", "actor", "actor_type", "action", "object_type", "object_id"}
    assert second.id != first.id


@pytest.mark.django_db
def test_audit_detail_returns_stored_redacted_json_and_has_no_write_route(audit_client):
    audit = write_audit_log(
        action=AuditAction.AUTH_LOGIN_FAILURE, object_type="auth", object_id="login",
        before={"nested": {"password": "secret"}}, after={"token": "secret"}, metadata={"cookie": "secret"},
    )
    response = audit_client.get(f"/api/v1/admin/audit/{audit.id}")
    assert response.status_code == 200
    payload = response.json()["data"]
    assert payload["before"] == {"nested": {"password": REDACTED_VALUE}}
    assert payload["after"] == {"token": REDACTED_VALUE}
    assert payload["metadata"] == {"cookie": REDACTED_VALUE}
    assert audit_client.post(f"/api/v1/admin/audit/{audit.id}").status_code == 405


@pytest.mark.django_db
def test_audit_list_validates_dates_ordering_and_page_size(audit_client):
    for query in ("from=not-a-date", "ordering=action", "page_size=101"):
        response = audit_client.get(f"/api/v1/admin/audit?{query}")
        assert response.status_code == 400
        assert response.json()["error"]["code"] == "validation_error"
