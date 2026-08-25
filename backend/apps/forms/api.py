from django.contrib.admin.views.decorators import staff_member_required
from django.db import transaction
from django.db.models import Prefetch
from django.http import FileResponse
from django.shortcuts import get_object_or_404
from rest_framework import status
from rest_framework.generics import GenericAPIView
from rest_framework.permissions import AllowAny
from rest_framework.response import Response
from rest_framework.throttling import ScopedRateThrottle

from .models import Form, FormField, SubmissionFile
from .serializers import PublicFormSubmissionSerializer


class PublicFormSubmissionView(GenericAPIView):
    serializer_class = PublicFormSubmissionSerializer
    authentication_classes = ()
    permission_classes = (AllowAny,)
    throttle_classes = (ScopedRateThrottle,)
    throttle_scope = "form-submissions"

    @transaction.atomic
    def post(self, request, form_key):
        form = get_object_or_404(
            Form.objects.prefetch_related(
                Prefetch("fields", queryset=FormField.objects.filter(is_active=True), to_attr="active_fields"),
                "translations",
            ),
            key=form_key,
            is_active=True,
        )
        serializer = PublicFormSubmissionSerializer(
            data=request.data,
            context={"request": request, "form": form},
        )
        serializer.is_valid(raise_exception=True)
        submission = serializer.save()
        translation = next(
            (item for item in form.translations.all() if item.locale == submission.locale),
            None,
        )
        return Response(
            {
                "data": {
                    "id": str(submission.id),
                    "message": translation.success_message if translation else "Request received.",
                    "redirect": form.success_redirect,
                }
            },
            status=status.HTTP_201_CREATED,
        )


@staff_member_required
def admin_submission_file_download(request, file_id):
    submission_file = get_object_or_404(SubmissionFile.objects.select_related("submission"), pk=file_id)
    return FileResponse(
        submission_file.file.open("rb"),
        as_attachment=True,
        filename=submission_file.original_name,
        content_type=submission_file.mime_type or "application/octet-stream",
    )
