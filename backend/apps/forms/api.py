import posixpath
from functools import wraps
from pathlib import Path

from django.contrib.auth.views import redirect_to_login
from django.core.exceptions import PermissionDenied, SuspiciousFileOperation
from django.db import transaction
from django.db.models import Prefetch
from django.http import FileResponse, Http404
from django.shortcuts import get_object_or_404
from django.urls import reverse_lazy
from rest_framework import status
from rest_framework.generics import GenericAPIView
from rest_framework.permissions import AllowAny
from rest_framework.response import Response
from rest_framework.throttling import ScopedRateThrottle

from .models import Form, FormField, SubmissionFile
from apps.accounts.roles import has_fixed_role_permission
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


def _open_private_submission_file(submission_file):
    """Open a stored file only after proving it stays in private storage."""
    name = submission_file.file.name
    if (
        not isinstance(name, str)
        or not name
        or "\\" in name
        or name.startswith("/")
        or posixpath.normpath(name) != name
    ):
        raise Http404

    storage = submission_file.file.storage
    try:
        resolved_file = Path(storage.path(name)).resolve()
        storage_root = Path(storage.location).resolve()
        resolved_file.relative_to(storage_root)
        return storage.open(name, "rb")
    except (FileNotFoundError, OSError, SuspiciousFileOperation, ValueError):
        raise Http404


def _private_file_access_required(view):
    @wraps(view)
    def wrapper(request, *args, **kwargs):
        if not request.user.is_authenticated:
            return redirect_to_login(request.get_full_path(), str(reverse_lazy("admin:login")))
        if not has_fixed_role_permission(request.user, "forms.view_submissionfile"):
            raise PermissionDenied
        return view(request, *args, **kwargs)

    return wrapper


@_private_file_access_required
def admin_submission_file_download(request, file_id):
    submission_file = get_object_or_404(SubmissionFile.objects.select_related("submission"), pk=file_id)
    return FileResponse(
        _open_private_submission_file(submission_file),
        as_attachment=True,
        filename=submission_file.original_name,
        content_type=submission_file.mime_type or "application/octet-stream",
    )
