from drf_spectacular.utils import OpenApiParameter, extend_schema
from rest_framework import serializers
from rest_framework.generics import GenericAPIView
from rest_framework.response import Response

from apps.core.api import VALID_LOCALES

from .models import SearchDocument
from .normalization import normalize_search_text


class SearchResultSerializer(serializers.Serializer):
    kind = serializers.CharField()
    title = serializers.CharField()
    summary = serializers.CharField()
    url = serializers.CharField()


class SearchView(GenericAPIView):
    authentication_classes = []
    permission_classes = []
    serializer_class = SearchResultSerializer

    @extend_schema(
        operation_id="search",
        parameters=[OpenApiParameter("locale", str), OpenApiParameter("q", str)],
    )
    def get(self, request):
        locale = request.query_params.get("locale", "fa")
        query = normalize_search_text(request.query_params.get("q", ""))
        if locale not in VALID_LOCALES:
            return Response({"error": {"code": "invalid_locale", "detail": "Unsupported locale."}}, status=400)
        if len(query) < 2:
            return Response({"data": [], "meta": {"count": 0}})
        results = SearchDocument.objects.filter(locale=locale, normalized_text__contains=query)[:30]
        data = [
            {"kind": item.kind, "title": item.title, "summary": item.summary, "url": item.public_path}
            for item in results
        ]
        return Response({"data": data, "meta": {"count": len(data)}})
