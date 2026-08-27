from __future__ import annotations

from datetime import datetime, time

from django.utils import timezone
from django.utils.dateparse import parse_date, parse_datetime
from drf_spectacular.utils import OpenApiParameter, OpenApiTypes, extend_schema
from rest_framework.response import Response
from rest_framework.views import APIView

from apps.accounts.auth_api import admin_session_required, error
from apps.accounts.roles import has_fixed_role_permission

from .audit import redact_secrets
from .models import AuditLog
from .serializers import AuditDetailResponseSerializer, AuditSummarySerializer, PaginatedAuditSerializer


PAGE_SIZE_DEFAULT = 20
PAGE_SIZE_MAX = 100
ORDERINGS = {"timestamp": "timestamp", "-timestamp": "-timestamp"}


def _query_error(fields):
    return Response(
        {"error": {"status": 400, "code": "validation_error", "detail": "Request validation failed.", "fields": fields}},
        status=400,
    )


def _positive_int(value, field, *, maximum=None):
    try:
        parsed = int(value)
    except (TypeError, ValueError):
        return None, {field: ["A valid integer is required."]}
    if parsed < 1 or (maximum is not None and parsed > maximum):
        limit = f" between 1 and {maximum}" if maximum else " greater than zero"
        return None, {field: [f"Ensure this value is{limit}."]}
    return parsed, {}


def _parse_boundary(value, field, *, upper=False):
    parsed = parse_datetime(value)
    if parsed is None:
        date_value = parse_date(value)
        if date_value is None:
            return None, {field: ["Enter a valid ISO-8601 date or datetime."]}
        parsed = datetime.combine(date_value, time.max if upper else time.min)
    if timezone.is_naive(parsed):
        parsed = timezone.make_aware(parsed)
    return parsed, {}


def _serialize_actor(actor):
    return {"id": actor.pk, "username": actor.get_username()} if actor else None


def _summary(audit):
    return {
        "id": audit.id,
        "timestamp": audit.timestamp,
        "actor": _serialize_actor(audit.actor),
        "actor_type": audit.actor_type,
        "action": audit.action,
        "object_type": audit.object_type,
        "object_id": audit.object_id,
    }


def _detail(audit):
    return {
        **_summary(audit),
        "before": redact_secrets(audit.before),
        "after": redact_secrets(audit.after),
        "metadata": redact_secrets(audit.metadata),
    }


AUDIT_PARAMETERS = [
    OpenApiParameter("page", OpenApiTypes.INT, OpenApiParameter.QUERY, required=False, description="1-based page number."),
    OpenApiParameter("page_size", OpenApiTypes.INT, OpenApiParameter.QUERY, required=False, description="Results per page (1-100)."),
    OpenApiParameter("actor_id", OpenApiTypes.INT, OpenApiParameter.QUERY, required=False),
    OpenApiParameter("actor_type", OpenApiTypes.STR, OpenApiParameter.QUERY, required=False, enum=[choice.value for choice in AuditLog.ActorType]),
    OpenApiParameter("action", OpenApiTypes.STR, OpenApiParameter.QUERY, required=False, enum=[choice.value for choice in AuditLog.Action]),
    OpenApiParameter("object_type", OpenApiTypes.STR, OpenApiParameter.QUERY, required=False),
    OpenApiParameter("object_id", OpenApiTypes.STR, OpenApiParameter.QUERY, required=False),
    OpenApiParameter("from", OpenApiTypes.DATETIME, OpenApiParameter.QUERY, required=False),
    OpenApiParameter("to", OpenApiTypes.DATETIME, OpenApiParameter.QUERY, required=False),
    OpenApiParameter("ordering", OpenApiTypes.STR, OpenApiParameter.QUERY, required=False, enum=list(ORDERINGS)),
]


class AuditPermissionMixin:
    def _check_audit_permission(self, request):
        if not has_fixed_role_permission(request.user, "core.view_auditlog"):
            return error("permission_denied", "You do not have permission to perform this action.", 403)
        return None


class AuditListView(AuditPermissionMixin, APIView):
    @extend_schema(operation_id="admin_audit_list", parameters=AUDIT_PARAMETERS, responses=PaginatedAuditSerializer)
    @admin_session_required
    def get(self, request):
        denied = self._check_audit_permission(request)
        if denied:
            return denied

        fields = {}
        page, page_error = _positive_int(request.query_params.get("page", 1), "page")
        fields.update(page_error)
        page_size, page_size_error = _positive_int(
            request.query_params.get("page_size", PAGE_SIZE_DEFAULT), "page_size", maximum=PAGE_SIZE_MAX
        )
        fields.update(page_size_error)
        ordering = request.query_params.get("ordering", "-timestamp")
        if ordering not in ORDERINGS:
            fields["ordering"] = ["Use timestamp or -timestamp."]

        boundaries = {}
        for name in ("from", "to"):
            if name in request.query_params:
                boundaries[name], boundary_error = _parse_boundary(
                    request.query_params[name], name, upper=name == "to"
                )
                fields.update(boundary_error)
        if not fields and "from" in boundaries and "to" in boundaries and boundaries["from"] > boundaries["to"]:
            fields["to"] = ["This value must be later than or equal to from."]
        if fields:
            return _query_error(fields)

        queryset = AuditLog.objects.select_related("actor").all()
        for field in ("actor_type", "action", "object_type", "object_id"):
            if field in request.query_params:
                queryset = queryset.filter(**{field: request.query_params[field]})
        if "actor_id" in request.query_params:
            actor_id, actor_error = _positive_int(request.query_params["actor_id"], "actor_id")
            if actor_error:
                return _query_error(actor_error)
            queryset = queryset.filter(actor_id=actor_id)
        if "from" in boundaries:
            queryset = queryset.filter(timestamp__gte=boundaries["from"])
        if "to" in boundaries:
            queryset = queryset.filter(timestamp__lte=boundaries["to"])

        direction = ORDERINGS[ordering]
        tie_breaker = "-id" if direction.startswith("-") else "id"
        queryset = queryset.order_by(direction, tie_breaker)
        total = queryset.count()
        start = (page - 1) * page_size
        records = queryset[start:start + page_size]
        total_pages = (total + page_size - 1) // page_size
        return Response({
            "data": [_summary(audit) for audit in records],
            "meta": {"page": page, "page_size": page_size, "total": total, "total_pages": total_pages},
        })


class AuditDetailView(AuditPermissionMixin, APIView):
    @extend_schema(operation_id="admin_audit_detail", responses=AuditDetailResponseSerializer)
    @admin_session_required
    def get(self, request, audit_id):
        denied = self._check_audit_permission(request)
        if denied:
            return denied
        try:
            audit = AuditLog.objects.select_related("actor").get(pk=audit_id)
        except AuditLog.DoesNotExist:
            return error("not_found", "Audit record not found.", 404)
        return Response({"data": _detail(audit)})
