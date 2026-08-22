import io
import uuid
import zipfile

import pytest
from datetime import timedelta
from django.contrib.auth import get_user_model
from django.core.management import call_command
from django.core.exceptions import ValidationError
from django.core.files.uploadedfile import SimpleUploadedFile
from django.urls import reverse
from django.utils import timezone

from apps.core.models import AuditLog
from .models import Form, FormSubmission
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
def test_private_download_requires_staff(client):
    url = reverse("admin-submission-file-download", kwargs={"file_id": uuid.uuid4()})
    response = client.get(url)
    assert response.status_code == 302
    assert response.url.startswith(reverse("admin:login"))

    staff = get_user_model().objects.create_user(username="form-reviewer", password="secret", is_staff=True)
    client.force_login(staff)
    assert client.get(url).status_code == 404


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
