from __future__ import annotations

from rest_framework import serializers

from .models import ContentBlock, ContentTranslation


class ContentBlockSerializer(serializers.ModelSerializer):
    type = serializers.CharField(source="block_type")

    class Meta:
        model = ContentBlock
        fields = ("id", "type", "variant", "order", "schema_version", "props")


class ContentSummarySerializer(serializers.ModelSerializer):
    key = serializers.CharField(source="item.key")
    kind = serializers.CharField(source="item.kind")
    url = serializers.CharField(source="public_path")

    class Meta:
        model = ContentTranslation
        fields = ("id", "key", "kind", "locale", "title", "slug", "url", "excerpt", "published_at")


class ContentDetailSerializer(ContentSummarySerializer):
    blocks = serializers.SerializerMethodField()
    seo = serializers.SerializerMethodField()

    class Meta(ContentSummarySerializer.Meta):
        fields = ContentSummarySerializer.Meta.fields + ("blocks", "seo")

    def get_blocks(self, obj) -> list[dict]:
        blocks = [block for block in obj.blocks.all() if block.is_active]
        return ContentBlockSerializer(blocks, many=True).data

    def get_seo(self, obj) -> dict:
        request = self.context.get("request")
        image_url = None
        if obj.og_image_id and obj.og_image.is_public:
            image_url = request.build_absolute_uri(obj.og_image.file.url) if request else obj.og_image.file.url
        return {
            "title": obj.seo_title or obj.title,
            "description": obj.seo_description or obj.excerpt,
            "canonical_url": obj.canonical_url,
            "robots": {"index": obj.robots_index, "follow": obj.robots_follow},
            "open_graph": {
                "title": obj.og_title or obj.seo_title or obj.title,
                "description": obj.og_description or obj.seo_description or obj.excerpt,
                "image": image_url,
            },
        }
