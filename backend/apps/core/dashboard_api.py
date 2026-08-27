from __future__ import annotations

from drf_spectacular.utils import extend_schema
from rest_framework import serializers
from rest_framework.response import Response
from rest_framework.views import APIView

from apps.accounts.auth_api import admin_session_required, error
from apps.accounts.roles import has_fixed_role_permission

from .dashboard import dashboard_summary


class DashboardUsersSerializer(serializers.Serializer):
    total = serializers.IntegerField()
    active = serializers.IntegerField()
    locked = serializers.IntegerField()


class DashboardContentSerializer(serializers.Serializer):
    draft = serializers.IntegerField()
    review = serializers.IntegerField()
    scheduled = serializers.IntegerField()
    published = serializers.IntegerField()
    archived = serializers.IntegerField()


class DashboardSubmissionsSerializer(serializers.Serializer):
    new = serializers.IntegerField()


class DashboardRevalidationSerializer(serializers.Serializer):
    pending = serializers.IntegerField()
    failed = serializers.IntegerField()


class DashboardDataSerializer(serializers.Serializer):
    generated_at = serializers.DateTimeField()
    users = DashboardUsersSerializer()
    content = DashboardContentSerializer()
    submissions = DashboardSubmissionsSerializer()
    revalidation = DashboardRevalidationSerializer()


class DashboardResponseSerializer(serializers.Serializer):
    data = DashboardDataSerializer()


class DashboardView(APIView):
    @extend_schema(operation_id="admin_dashboard", responses=DashboardResponseSerializer)
    @admin_session_required
    def get(self, request):
        if not has_fixed_role_permission(request.user, "accounts.view_dashboard"):
            return error("permission_denied", "You do not have permission to view the dashboard.", 403)
        return Response({"data": DashboardDataSerializer(dashboard_summary()).data})
