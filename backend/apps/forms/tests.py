import io
import uuid
import zipfile

import pytest
from datetime import timedelta
from django.contrib.auth import get_user_model
from django.contrib.auth.models import Permission
from django.core.management import call_command
from django.core.exceptions import ValidationError
from django.core.files.uploadedfile import SimpleUploadedFile
from django.urls import reverse
from django.utils import timezone

from apps.core.models import AuditLog
from apps.accounts.roles import assign_fixed_role, provision_roles
from .models import Form, FormField, FormSubmission, FormTranslation, SubmissionFile
from .validators import validate_submission_file


def test_rejects_executable_extension():
    upload = SimpleUploadedFile("payload.exe", b"MZ")
    with pytest.raises(ValidationError):
        validate_submission_file(upload)


def test_rejects_extension_spoofing():
    upload = SimpleUploadedFile("spoofed.pdf", b"MZ-not-a-pdf")
    with pytest.raises(ValidationError):
        validate_submission_file(upload)


def test_accepts_structurally_valid_docx_container():
    buffer = io.BytesIO()
    with zipfile.ZipFile(buffer, "w") as archive:
        archive.writestr("[Content_Types].xml", "<Types/>")
        archive.writestr("word/document.xml", "<document/>")
    upload = SimpleUploadedFile(
        "safe.docx", buffer.getvalue(),
        content_type="application/vnd.openxmlformats-officedocument.wordprocessingml.document",
    )
    validate_submission_file(upload)


def test_rejects_mismatched_declared_mime_type():
    upload = SimpleUploadedFile("document.pdf", b"%PDF-1.7", content_type="image/png")
    with pytest.raises(ValidationError):
        validate_submission_file(upload)


@pytest.mark.django_db
def test_private_download_anonymous_denial_does_not_enumerate_files(client):
    url = reverse("admin-submission-file-download", kwargs={"file_id": uuid.uuid4()})
    response = client.get(url)
    assert response.status_code == 302
    assert response.url.startswith(reverse("admin:login"))


@pytest.mark.django_db
def test_private_download_requires_explicit_permission_before_lookup(client):
    reviewer = get_user_model().objects.create_user(username="form-reviewer", password="secret", is_staff=True)
    client.force_login(reviewer)
    response = client.get(reverse("admin-submission-file-download", kwargs={"file_id": uuid.uuid4()}))
    assert response.status_code == 403
    assert "private-media" not in response.content.decode().lower()


@pytest.mark.django_db
def test_private_download_allows_permission_and_superuser(client, tmp_path, settings):
    settings.PRIVATE_MEDIA_ROOT = tmp_path
    provision_roles()
    form = Form.objects.create(key="download")
    submission = FormSubmission.objects.create(
        form=form, locale="en", data={}, consent_given=True,
        expires_at=timezone.now() + timedelta(days=1),
    )
    stored = submission.files.create(
        file=SimpleUploadedFile("report.txt", b"private report"),
        original_name="report.txt", mime_type="text/plain", size=14,
        checksum_sha256="0" * 64,
    )
    reviewer = get_user_model().objects.create_user(username="form-reviewer", password="secret", is_staff=True)
    assign_fixed_role(reviewer, "submission-reviewer")
    client.force_login(reviewer)
    response = client.get(reverse("admin-submission-file-download", kwargs={"file_id": stored.pk}))
    assert response.status_code == 200
    assert b"".join(response.streaming_content) == b"private report"

    superuser = get_user_model().objects.create_superuser(username="form-admin", password="secret", email="admin@example.com")
    client.force_login(superuser)
    assert client.get(reverse("admin-submission-file-download", kwargs={"file_id": stored.pk})).status_code == 200


@pytest.mark.django_db
def test_private_download_rejects_unsafe_storage_name(client, settings, tmp_path):
    settings.PRIVATE_MEDIA_ROOT = tmp_path
    provision_roles()
    form = Form.objects.create(key="download-safety")
    submission = FormSubmission.objects.create(
        form=form, locale="en", data={}, consent_given=True,
        expires_at=timezone.now() + timedelta(days=1),
    )
    stored = SubmissionFile.objects.create(
        submission=submission, file="../outside.txt", original_name="outside.txt",
        mime_type="text/plain", size=1, checksum_sha256="0" * 64,
    )
    reviewer = get_user_model().objects.create_user(username="safe-reviewer", password="secret", is_staff=True)
    assign_fixed_role(reviewer, "submission-reviewer")
    client.force_login(reviewer)
    response = client.get(reverse("admin-submission-file-download", kwargs={"file_id": stored.pk}))
    assert response.status_code == 404
    assert b"outside.txt" not in response.content
    assert str(tmp_path).encode() not in response.content


@pytest.mark.django_db
def test_retention_command_purges_only_expired_submissions():
    form = Form.objects.create(key="retention")
    expired = FormSubmission.objects.create(
        form=form, locale="en", data={}, consent_given=True,
        expires_at=timezone.now() - timedelta(seconds=1),
    )
    active = FormSubmission.objects.create(
        form=form, locale="en", data={}, consent_given=True,
        expires_at=timezone.now() + timedelta(days=1),
    )
    call_command("purge_expired_submissions")
    assert not FormSubmission.objects.filter(pk=expired.pk).exists()
    assert FormSubmission.objects.filter(pk=active.pk).exists()
    assert AuditLog.objects.filter(action="retention_purge", object_id=str(expired.pk)).exists()


def consultation_form():
    form, _ = Form.objects.get_or_create(key="test-consultation")
    FormTranslation.objects.get_or_create(
        form=form,
        locale="fa",
        defaults={"title": "مشاوره", "success_message": "ثبت شد", "consent_label": "موافقم"},
    )
    fields = [
        ("full_name", FormField.FieldType.TEXT, True, 1),
        ("phone", FormField.FieldType.PHONE, True, 2),
        ("need_type", FormField.FieldType.SELECT, True, 3),
        ("details", FormField.FieldType.TEXTAREA, True, 4),
    ]
    for key, field_type, required, order in fields:
        FormField.objects.update_or_create(
            form=form,
            key=key,
            defaults={
                "field_type": field_type,
                "required": required,
                "order": order,
                "options": ["assessment", "security"] if key == "need_type" else [],
            },
        )
    return form


@pytest.mark.django_db
def test_public_form_submission_is_validated_and_saved(api_client):
    form = consultation_form()
    response = api_client.post(
        reverse("form-submission-create", kwargs={"form_key": form.key}),
        {
            "locale": "fa",
            "data": {
                "full_name": "علی رضایی",
                "phone": "09123456789",
                "need_type": "assessment",
                "details": "برای بررسی وضعیت شبکه و پشتیبان‌گیری نیاز به مشاوره داریم.",
            },
            "consent_given": True,
            "source_url": "http://localhost:3000/fa/contact",
        },
        format="json",
    )
    assert response.status_code == 201
    submission = FormSubmission.objects.get(pk=response.json()["data"]["id"])
    assert submission.form == form
    assert submission.status == FormSubmission.Status.NEW
    assert submission.data["phone"] == "09123456789"
    assert submission.ip_hash


@pytest.mark.django_db
def test_public_form_submission_rejects_missing_consent_and_unknown_fields(api_client):
    form = consultation_form()
    response = api_client.post(
        reverse("form-submission-create", kwargs={"form_key": form.key}),
        {
            "locale": "fa",
            "data": {
                "full_name": "علی رضایی",
                "phone": "09123456789",
                "need_type": "assessment",
                "details": "نیاز به مشاوره داریم.",
                "is_admin": True,
            },
            "consent_given": False,
        },
        format="json",
    )
    assert response.status_code == 400
    assert FormSubmission.objects.filter(form=form).count() == 0


@pytest.fixture
def api_client():
    from rest_framework.test import APIClient

    return APIClient()
