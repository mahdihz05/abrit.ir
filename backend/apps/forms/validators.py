from __future__ import annotations

import zipfile
from pathlib import Path

from django.core.exceptions import ValidationError


MAX_FILE_SIZE = 10 * 1024 * 1024
ALLOWED_EXTENSIONS = {".pdf", ".docx", ".xlsx", ".jpg", ".jpeg", ".png"}
ALLOWED_MIME_TYPES = {
    ".pdf": {"application/pdf", "application/octet-stream"},
    ".docx": {"application/vnd.openxmlformats-officedocument.wordprocessingml.document", "application/octet-stream", "application/zip"},
    ".xlsx": {"application/vnd.openxmlformats-officedocument.spreadsheetml.sheet", "application/octet-stream", "application/zip"},
    ".jpg": {"image/jpeg", "application/octet-stream"},
    ".jpeg": {"image/jpeg", "application/octet-stream"},
    ".png": {"image/png", "application/octet-stream"},
}
IMAGE_SIGNATURES = {
    ".jpg": (b"\xff\xd8\xff",),
    ".jpeg": (b"\xff\xd8\xff",),
    ".png": (b"\x89PNG\r\n\x1a\n",),
}


def validate_submission_file(uploaded_file):
    extension = Path(uploaded_file.name).suffix.lower()
    if extension not in ALLOWED_EXTENSIONS:
        raise ValidationError("This file type is not allowed.")
    if uploaded_file.size > MAX_FILE_SIZE:
        raise ValidationError("Each file must be 10MB or smaller.")
    content_type = getattr(uploaded_file, "content_type", "application/octet-stream") or "application/octet-stream"
    if content_type.lower() not in ALLOWED_MIME_TYPES[extension]:
        raise ValidationError("The declared MIME type does not match the file extension.")

    position = uploaded_file.tell()
    try:
        header = uploaded_file.read(16)
        uploaded_file.seek(0)
        if extension == ".pdf" and not header.startswith(b"%PDF-"):
            raise ValidationError("The file signature does not match PDF.")
        if extension in IMAGE_SIGNATURES and not header.startswith(IMAGE_SIGNATURES[extension]):
            raise ValidationError("The file signature does not match the image extension.")
        if extension in {".docx", ".xlsx"}:
            _validate_ooxml(uploaded_file, extension)
    except (OSError, zipfile.BadZipFile) as exc:
        raise ValidationError("The uploaded file is corrupt or unsafe.") from exc
    finally:
        uploaded_file.seek(position)


def _validate_ooxml(uploaded_file, extension):
    expected = "word/document.xml" if extension == ".docx" else "xl/workbook.xml"
    with zipfile.ZipFile(uploaded_file) as archive:
        names = set(archive.namelist())
        if expected not in names or "[Content_Types].xml" not in names:
            raise ValidationError("The Office document structure is invalid.")
        if any(name.lower().endswith("vbaproject.bin") for name in names):
            raise ValidationError("Macro-enabled Office documents are not allowed.")
        if len(names) > 5000:
            raise ValidationError("The Office document contains too many internal files.")
        expanded_size = sum(info.file_size for info in archive.infolist())
        if expanded_size > 50 * 1024 * 1024:
            raise ValidationError("The Office document expands beyond the safety limit.")
