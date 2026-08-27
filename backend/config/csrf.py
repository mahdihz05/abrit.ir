from django.http import JsonResponse


def csrf_failure(request, reason=""):
    if request.path.startswith("/api/v1/admin/"):
        return JsonResponse(
            {"error": {"status": 403, "code": "csrf_failed", "detail": "CSRF verification failed."}},
            status=403,
        )
    from django.views.csrf import csrf_failure as django_csrf_failure
    return django_csrf_failure(request, reason=reason)
