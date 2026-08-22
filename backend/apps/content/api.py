from django.shortcuts import get_object_or_404
from drf_spectacular.utils import extend_schema
from rest_framework.generics import GenericAPIView
from rest_framework.response import Response

from apps.core.api import VALID_LOCALES

from .models import ContentItem, ContentTranslation
from .serializers import ContentDetailSerializer, ContentSummarySerializer


def published_content():
    return ContentTranslation.objects.filter(
        item__is_active=True,
        workflow_status=ContentTranslation.WorkflowStatus.PUBLISHED,
        translation_status=ContentTranslation.TranslationStatus.REVIEWED,
    ).select_related("item", "og_image")


class ContentListView(GenericAPIView):
    authentication_classes = []
    permission_classes = []
    serializer_class = ContentSummarySerializer

    @extend_schema(operation_id="content_list")
    def get(self, request, kind, locale):
        if locale not in VALID_LOCALES or kind not in ContentItem.Kind.values:
            return Response({"error": {"code": "not_found", "detail": "Content collection not found."}}, status=404)
        queryset = published_content().filter(locale=locale, item__kind=kind).order_by("-published_at", "title")
        serializer = ContentSummarySerializer(queryset, many=True)
        return Response({"data": serializer.data, "meta": {"count": len(serializer.data)}})


class ContentDetailView(GenericAPIView):
    authentication_classes = []
    permission_classes = []
    serializer_class = ContentDetailSerializer

    @extend_schema(operation_id="content_detail")
    def get(self, request, locale, path=""):
        if locale not in VALID_LOCALES:
            return Response({"error": {"code": "not_found", "detail": "Content not found."}}, status=404)
        translation = get_object_or_404(
            published_content().prefetch_related("blocks"), locale=locale, path=path.strip("/")
        )
        serializer = ContentDetailSerializer(translation, context={"request": request})
        return Response({"data": serializer.data})


class RootContentDetailView(ContentDetailView):
    @extend_schema(operation_id="content_root")
    def get(self, request, locale):
        return super().get(request, locale, path="")
