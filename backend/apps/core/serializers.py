from __future__ import annotations

from rest_framework import serializers

from .models import DesignSettings, SiteSettings, SiteSettingsTranslation


class SiteSettingsSerializer(serializers.ModelSerializer):
    location = serializers.SerializerMethodField()
    address = serializers.SerializerMethodField()
    seo = serializers.SerializerMethodField()
    logo_url = serializers.SerializerMethodField()
    favicon_url = serializers.SerializerMethodField()
    design_tokens = serializers.SerializerMethodField()

    class Meta:
        model = SiteSettings
        fields = (
            "brand_name",
            "phone",
            "email",
            "default_locale",
            "customer_portal_url",
            "external_checkout_url",
            "social_links",
            "location",
            "address",
            "seo",
            "logo_url",
            "favicon_url",
            "design_tokens",
        )

    def _translation(self, obj) -> SiteSettingsTranslation | None:
        locale = self.context["locale"]
        return next((item for item in obj.translations.all() if item.locale == locale), None)

    def get_location(self, obj) -> str:
        translation = self._translation(obj)
        return translation.location_label if translation else ""

    def get_address(self, obj) -> str:
        translation = self._translation(obj)
        return translation.address if translation else ""

    def get_seo(self, obj) -> dict[str, str]:
        translation = self._translation(obj)
        if not translation:
            return {"title": "", "description": ""}
        return {"title": translation.default_seo_title, "description": translation.default_seo_description}

    def _asset_url(self, asset) -> str | None:
        if not asset or not asset.is_public:
            return None
        request = self.context.get("request")
        url = asset.file.url
        return request.build_absolute_uri(url) if request else url

    def get_logo_url(self, obj) -> str | None:
        return self._asset_url(obj.logo)

    def get_favicon_url(self, obj) -> str | None:
        return self._asset_url(obj.favicon)

    def get_design_tokens(self, obj) -> dict:
        design = DesignSettings.objects.first()
        if not design:
            return {}
        return {
            "colors": {
                "primary": design.primary,
                "secondary": design.secondary,
                "accent": design.accent,
                "background": design.background,
                "surface": design.surface,
                "foreground": design.foreground,
                "muted": design.muted,
            },
            "radius": {"small": design.radius_small, "medium": design.radius_medium, "large": design.radius_large},
            "container_width": design.container_width,
            "section_spacing": design.section_spacing,
            "motion_enabled": design.motion_enabled,
        }
