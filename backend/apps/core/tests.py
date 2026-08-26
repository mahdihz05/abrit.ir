import pytest
from django.contrib import admin
from django.core.exceptions import ValidationError
from django.db import transaction

from .admin import AuditLogAdmin
from .audit import AuditAction, REDACTED_VALUE, redact_secrets, write_audit_log
from .models import AuditLog, DesignSettings, SiteSettings


@pytest.mark.django_db
def test_site_settings_is_a_singleton():
    SiteSettings.objects.create()
    with pytest.raises(ValidationError):
        SiteSettings.objects.create()


@pytest.mark.django_db
def test_design_settings_rejects_unsafe_geometry():
    design = DesignSettings(container_width=400)
    with pytest.raises(ValidationError):
        design.full_clean()


def test_recursive_secret_redaction_does_not_mutate_the_source():
    payload = {
        "password": "top-secret",
        "profile": {
            "api_token": "abc",
            "items": [{"session_cookie": "cookie-value"}, {"safe": "kept"}],
        },
    }

    result = redact_secrets(payload)

    assert result == {
        "password": REDACTED_VALUE,
        "profile": {
            "api_token": REDACTED_VALUE,
            "items": [{"session_cookie": REDACTED_VALUE}, {"safe": "kept"}],
        },
    }
    assert payload["profile"]["api_token"] == "abc"


@pytest.mark.django_db
def test_audit_writer_stores_only_redacted_json_and_metadata():
    audit = write_audit_log(
        action=AuditAction.USER_PASSWORD_RESET,
        object_type="user",
        object_id="42",
        before={"nested": {"password": "never-store"}},
        after={"access_token": "also-never-store"},
        metadata={"request": {"authorization": "Bearer secret"}},
    )

    audit.refresh_from_db()
    assert audit.before["nested"]["password"] == REDACTED_VALUE
    assert audit.after["access_token"] == REDACTED_VALUE
    assert audit.metadata["request"]["authorization"] == REDACTED_VALUE


@pytest.mark.django_db
def test_audit_writer_rejects_uncontrolled_actions():
    with pytest.raises(ValidationError):
        write_audit_log(action="arbitrary_event", object_type="user", object_id="42")


@pytest.mark.django_db
def test_audit_writes_roll_back_with_the_callers_transaction():
    with pytest.raises(RuntimeError), transaction.atomic():
        write_audit_log(action=AuditAction.USER_CREATE, object_type="user", object_id="42")
        raise RuntimeError("abort mutation")

    assert not AuditLog.objects.filter(object_type="user", object_id="42").exists()


def test_audit_log_admin_is_read_only():
    audit_admin = AuditLogAdmin(AuditLog, admin.site)
    assert audit_admin.has_add_permission(None) is False
    assert audit_admin.has_change_permission(None) is False
    assert audit_admin.has_delete_permission(None) is False
