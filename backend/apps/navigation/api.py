from drf_spectacular.utils import extend_schema
from rest_framework import serializers
from rest_framework.generics import GenericAPIView
from rest_framework.response import Response

from apps.content.models import ContentTranslation
from apps.core.api import VALID_LOCALES

from .models import Menu, MenuItem


class NavigationItemSerializer(serializers.Serializer):
    id = serializers.UUIDField()
    title = serializers.CharField()
    description = serializers.CharField()
    url = serializers.CharField()
    icon = serializers.CharField()
    column = serializers.IntegerField()
    open_in_new_tab = serializers.BooleanField()
    featured_image = serializers.CharField(allow_null=True)
    children = serializers.ListField(child=serializers.DictField())


class NavigationView(GenericAPIView):
    authentication_classes = []
    permission_classes = []
    serializer_class = NavigationItemSerializer

    @extend_schema(operation_id="navigation")
    def get(self, request, location, locale):
        if locale not in VALID_LOCALES or location not in Menu.Location.values:
            return Response({"error": {"code": "not_found", "detail": "Navigation not found."}}, status=404)
        menu = Menu.objects.filter(location=location, is_active=True).first()
        if not menu:
            return Response({"data": []})
        items = list(
            menu.items.filter(is_active=True)
            .select_related("internal_target", "featured_image")
            .prefetch_related("translations", "internal_target__translations")
            .order_by("order")
        )
        by_parent: dict[str | None, list[MenuItem]] = {}
        for item in items:
            by_parent.setdefault(str(item.parent_id) if item.parent_id else None, []).append(item)

        def serialize(item):
            translation = next((value for value in item.translations.all() if value.locale == locale), None)
            if not translation:
                return None
            url = item.external_url.replace("{locale}", locale)
            if item.internal_target_id:
                target = next(
                    (
                        value
                        for value in item.internal_target.translations.all()
                        if value.locale == locale
                        and value.workflow_status == ContentTranslation.WorkflowStatus.PUBLISHED
                        and value.translation_status == ContentTranslation.TranslationStatus.REVIEWED
                    ),
                    None,
                )
                if not target:
                    return None
                url = target.public_path
            children = [value for child in by_parent.get(str(item.id), []) if (value := serialize(child))]
            image = None
            if item.featured_image_id and item.featured_image.is_public:
                image = request.build_absolute_uri(item.featured_image.file.url)
            return {
                "id": item.id,
                "title": translation.title,
                "description": translation.description,
                "url": url,
                "icon": item.icon_key,
                "column": item.column,
                "open_in_new_tab": item.open_in_new_tab,
                "featured_image": image,
                "children": children,
            }

        data = [value for item in by_parent.get(None, []) if (value := serialize(item))]
        return Response({"data": data})
