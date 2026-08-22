import io
import zipfile

import pytest
from django.core.exceptions import ValidationError
from django.core.files.uploadedfile import SimpleUploadedFile

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
    upload = SimpleUploadedFile("safe.docx", buffer.getvalue())
    validate_submission_file(upload)
