from django.contrib.admin.views.decorators import staff_member_required
from django.http import FileResponse
from django.shortcuts import get_object_or_404

from .models import SubmissionFile


@staff_member_required
def admin_submission_file_download(request, file_id):
    submission_file = get_object_or_404(SubmissionFile.objects.select_related("submission"), pk=file_id)
    return FileResponse(
        submission_file.file.open("rb"),
        as_attachment=True,
        filename=submission_file.original_name,
        content_type=submission_file.mime_type or "application/octet-stream",
    )
