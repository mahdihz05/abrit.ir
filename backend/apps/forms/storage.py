from django.conf import settings
from django.core.files.storage import FileSystemStorage


private_submission_storage = FileSystemStorage(
    location=settings.PRIVATE_MEDIA_ROOT / "form-submissions",
    base_url=None,
)
