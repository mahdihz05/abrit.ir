from rest_framework.views import exception_handler as drf_exception_handler


def exception_handler(exc, context):
    response = drf_exception_handler(exc, context)
    if response is None:
        return None

    detail = response.data
    code = getattr(exc, "default_code", "request_error")
    request = context.get("request")
    if request is not None and request.path.startswith("/api/v1/admin/") and code == "permission_denied" and "csrf" in str(detail).lower():
        code = "csrf_failed"
        detail = "CSRF verification failed."
    response.data = {
        "error": {
            "status": response.status_code,
            "code": code,
            "detail": detail,
        }
    }
    return response
