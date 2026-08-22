from rest_framework.views import exception_handler as drf_exception_handler


def exception_handler(exc, context):
    response = drf_exception_handler(exc, context)
    if response is None:
        return None

    detail = response.data
    response.data = {
        "error": {
            "status": response.status_code,
            "code": getattr(exc, "default_code", "request_error"),
            "detail": detail,
        }
    }
    return response
