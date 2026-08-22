from django.http import JsonResponse
from django.shortcuts import get_object_or_404
from drf_spectacular.utils import OpenApiParameter, extend_schema
from rest_framework.generics import GenericAPIView
from rest_framework.response import Response

from .models import LOCALE_CHOICES, SiteSettings
from .serializers import SiteSettingsSerializer


VALID_LOCALES = {item[0] for item in LOCALE_CHOICES}


def health(request):
    return JsonResponse({"status": "ok", "service": "abrit-cms", "api_version": "v1"})


class SiteSettingsView(GenericAPIView):
    authentication_classes = []
    permission_classes = []
    serializer_class = SiteSettingsSerializer

    @extend_schema(operation_id="site_settings", parameters=[OpenApiParameter("locale", str)])
    def get(self, request):
        locale = request.query_params.get("locale", "fa")
        if locale not in VALID_LOCALES:
            return Response({"error": {"code": "invalid_locale", "detail": "Unsupported locale."}}, status=400)
        settings = get_object_or_404(
            SiteSettings.objects.prefetch_related("translations").select_related("logo", "favicon")
        )
        serializer = SiteSettingsSerializer(settings, context={"request": request, "locale": locale})
        return Response({"data": serializer.data})
