from __future__ import annotations

from rest_framework import serializers

from .models import Package


class PackageSerializer(serializers.ModelSerializer):
    name = serializers.SerializerMethodField()
    audience = serializers.SerializerMethodField()
    description = serializers.SerializerMethodField()
    sla = serializers.SerializerMethodField()
    addon_rates = serializers.SerializerMethodField()

    class Meta:
        model = Package
        fields = (
            "key", "order", "name", "audience", "description", "base_monthly_toman", "currency",
            "included_users", "included_endpoints", "included_servers", "included_sites", "sla",
            "addon_rates", "is_featured",
        )

    def _translation(self, obj):
        locale = self.context["locale"]
        return next((item for item in obj.translations.all() if item.locale == locale), None)

    def get_name(self, obj) -> str:
        item = self._translation(obj)
        return item.name if item else obj.key

    def get_audience(self, obj) -> str:
        item = self._translation(obj)
        return item.audience if item else ""

    def get_description(self, obj) -> str:
        item = self._translation(obj)
        return item.description if item else ""

    def get_sla(self, obj) -> str:
        item = self._translation(obj)
        return item.sla_text if item else ""

    def get_addon_rates(self, obj) -> dict[str, int]:
        return {rate.addon_type: rate.monthly_toman for rate in obj.addon_rates.all()}


class PricingRequestSerializer(serializers.Serializer):
    package = serializers.SlugField()
    term_months = serializers.ChoiceField(choices=(3, 6, 12))
    users = serializers.IntegerField(min_value=0, max_value=10000)
    endpoints = serializers.IntegerField(min_value=0, max_value=10000)
