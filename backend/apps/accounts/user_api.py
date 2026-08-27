from __future__ import annotations

from functools import wraps

from django.contrib.auth import password_validation
from django.contrib.auth.models import User
from django.db import transaction
from django.utils import timezone
from drf_spectacular.utils import OpenApiParameter, OpenApiTypes, extend_schema
from rest_framework.response import Response
from rest_framework.views import APIView

from apps.core.audit import AuditAction, write_audit_log

from .auth_api import admin_session_required, error
from .models import AccountSecurity
from .roles import ROLE_BY_KEY, assign_fixed_role, fixed_role_for_user
from .user_serializers import (
    ChangedResponseSerializer, PasswordSerializer, PaginatedUserSerializer,
    UserCreateSerializer, UserPatchSerializer, UserResponseSerializer,
)


PAGE_SIZE_DEFAULT = 20
PAGE_SIZE_MAX = 100
ORDERINGS = {"username": "username", "-username": "-username", "date_joined": "date_joined", "-date_joined": "-date_joined"}


def _validation(fields):
    return Response({"error": {"status": 400, "code": "validation_error", "detail": "Request validation failed.", "fields": fields}}, status=400)


def _superuser_required(view):
    @wraps(view)
    @admin_session_required
    def wrapped(self, request, *args, **kwargs):
        if not request.user.is_superuser:
            return error("permission_denied", "Only superusers may manage users.", 403)
        return view(self, request, *args, **kwargs)
    return wrapped


def _positive(value, field, maximum=None):
    try:
        value = int(value)
    except (TypeError, ValueError):
        return None, {field: ["A valid integer is required."]}
    if value < 1 or maximum is not None and value > maximum:
        suffix = f" between 1 and {maximum}" if maximum else " greater than zero"
        return None, {field: [f"Ensure this value is{suffix}."]}
    return value, {}


def _role_data(user):
    role = fixed_role_for_user(user)
    return {"key": role.key, "name": role.name} if role else None


def _user_data(user):
    security = AccountSecurity.objects.filter(user=user).first()
    locked_until = security.locked_until if security else None
    return {
        "id": user.pk, "username": user.username, "email": user.email,
        "first_name": user.first_name, "last_name": user.last_name,
        "is_active": user.is_active, "is_superuser": user.is_superuser,
        "role": _role_data(user), "is_locked": bool(locked_until and locked_until > timezone.now()),
        "locked_until": locked_until, "last_login": user.last_login, "date_joined": user.date_joined,
    }


def _get_user(user_id):
    try:
        return User.objects.get(pk=user_id)
    except (User.DoesNotExist, ValueError):
        return None


def _protected_target(request, user):
    if user is None:
        return error("not_found", "User not found.", 404)
    if user.is_superuser:
        return error("superuser_protected", "Superusers cannot be changed through this API.", 409)
    return None


def _audit_state(user):
    data = _user_data(user)
    return {key: value for key, value in data.items() if key in {
        "id", "username", "email", "first_name", "last_name", "is_active", "is_superuser", "role",
    }}


def _apply_role(user, role_key):
    if role_key in (None, ""):
        assign_fixed_role(user, None)
        return
    if role_key not in ROLE_BY_KEY:
        raise ValueError("reserved_role")
    assign_fixed_role(user, role_key)


class UserListView(APIView):
    @extend_schema(
        operation_id="admin_user_list", responses=PaginatedUserSerializer,
        parameters=[
            OpenApiParameter("page", OpenApiTypes.INT, description="1-based page number."),
            OpenApiParameter("page_size", OpenApiTypes.INT, description="Results per page (1-100)."),
            OpenApiParameter("search", OpenApiTypes.STR),
            OpenApiParameter("status", OpenApiTypes.STR, enum=["active", "inactive"]),
            OpenApiParameter("role", OpenApiTypes.STR, enum=list(ROLE_BY_KEY)),
            OpenApiParameter("ordering", OpenApiTypes.STR, enum=list(ORDERINGS)),
        ],
    )
    @_superuser_required
    def get(self, request):
        fields = {}
        page, page_error = _positive(request.query_params.get("page", 1), "page")
        size, size_error = _positive(request.query_params.get("page_size", PAGE_SIZE_DEFAULT), "page_size", PAGE_SIZE_MAX)
        fields.update(page_error); fields.update(size_error)
        ordering = request.query_params.get("ordering", "username")
        if ordering not in ORDERINGS:
            fields["ordering"] = ["Use username, -username, date_joined, or -date_joined."]
        status = request.query_params.get("status")
        if status not in (None, "active", "inactive"):
            fields["status"] = ["Use active or inactive."]
        role = request.query_params.get("role")
        if role is not None and role not in ROLE_BY_KEY:
            fields["role"] = ["Select a valid fixed role."]
        if fields:
            return _validation(fields)
        queryset = User.objects.all()
        search = request.query_params.get("search")
        if search:
            from django.db.models import Q
            queryset = queryset.filter(Q(username__icontains=search) | Q(email__icontains=search) | Q(first_name__icontains=search) | Q(last_name__icontains=search))
        if status:
            queryset = queryset.filter(is_active=status == "active")
        if role:
            queryset = queryset.filter(groups__name=role, user_permissions__isnull=True).distinct()
        direction = ORDERINGS[ordering]
        queryset = queryset.order_by(direction, "-pk" if direction.startswith("-") else "pk")
        total = queryset.count()
        records = queryset[(page - 1) * size:page * size]
        return Response({"data": [_user_data(user) for user in records], "meta": {"page": page, "page_size": size, "total": total, "total_pages": (total + size - 1) // size}})


class UserDetailView(APIView):
    @extend_schema(operation_id="admin_user_detail", responses=UserResponseSerializer)
    @_superuser_required
    def get(self, request, user_id):
        user = _get_user(user_id)
        if user is None:
            return error("not_found", "User not found.", 404)
        return Response({"data": _user_data(user)})

    @extend_schema(operation_id="admin_user_update", request=UserPatchSerializer, responses=UserResponseSerializer)
    @_superuser_required
    def patch(self, request, user_id):
        return UserMutationView().patch(request, user_id)


class UserCollectionView(APIView):
    @extend_schema(operation_id="admin_user_list", responses=PaginatedUserSerializer)
    @_superuser_required
    def get(self, request):
        return UserListView().get(request)

    @extend_schema(operation_id="admin_user_create", request=UserCreateSerializer, responses=UserResponseSerializer)
    @_superuser_required
    def post(self, request):
        unexpected = sorted(set(request.data) - {"username", "email", "first_name", "last_name", "password", "role", "is_active"})
        if unexpected:
            return _validation({field: ["This field is not writable through this API."] for field in unexpected})
        serializer = UserCreateSerializer(data=request.data)
        if not serializer.is_valid():
            return _validation(serializer.errors)
        values = serializer.validated_data
        if User.objects.filter(username=values["username"]).exists():
            return _validation({"username": ["A user with that username already exists."]})
        role = values.get("role")
        if role not in ROLE_BY_KEY and role not in (None, ""):
            return error("reserved_role", "Select a valid fixed role.", 409)
        user = User(username=values["username"], email=values.get("email", ""), first_name=values.get("first_name", ""), last_name=values.get("last_name", ""), is_active=values.get("is_active", True))
        try:
            password_validation.validate_password(values["password"], user)
        except Exception as exc:
            return _validation({"password": getattr(exc, "messages", [str(exc)])})
        with transaction.atomic():
            user.set_password(values["password"])
            user.save()
            _apply_role(user, role)
            write_audit_log(action=AuditAction.USER_CREATE, object_type="user", object_id=str(user.pk), actor=request.user, after=_audit_state(user))
        return Response({"data": _user_data(user)}, status=201)


class UserMutationView(APIView):
    @extend_schema(operation_id="admin_user_update", request=UserPatchSerializer, responses=UserResponseSerializer)
    @_superuser_required
    def patch(self, request, user_id):
        user = _get_user(user_id)
        denied = _protected_target(request, user)
        if denied: return denied
        unexpected = sorted(set(request.data) - {"username", "email", "first_name", "last_name", "role"})
        if unexpected:
            return _validation({field: ["This field is not writable through this API."] for field in unexpected})
        serializer = UserPatchSerializer(data=request.data)
        if not serializer.is_valid(): return _validation(serializer.errors)
        values = serializer.validated_data
        if "username" in values and User.objects.filter(username=values["username"]).exclude(pk=user.pk).exists():
            return _validation({"username": ["A user with that username already exists."]})
        if "role" in values and values["role"] not in ROLE_BY_KEY and values["role"] not in (None, ""):
            return error("reserved_role", "Select a valid fixed role.", 409)
        before = _audit_state(user)
        old_role = fixed_role_for_user(user)
        with transaction.atomic():
            for field in ("username", "email", "first_name", "last_name"):
                if field in values: setattr(user, field, values[field])
            user.save(update_fields=[field for field in ("username", "email", "first_name", "last_name") if field in values])
            if "role" in values: _apply_role(user, values["role"])
            write_audit_log(action=AuditAction.USER_UPDATE, object_type="user", object_id=str(user.pk), actor=request.user, before=before, after=_audit_state(user))
            new_role = fixed_role_for_user(user)
            if "role" in values and (old_role.key if old_role else None) != (new_role.key if new_role else None):
                write_audit_log(action=AuditAction.USER_ROLE_CHANGE, object_type="user", object_id=str(user.pk), actor=request.user, before={"role": old_role.key if old_role else None}, after={"role": new_role.key if new_role else None})
        return Response({"data": _user_data(user)})


class UserPasswordView(APIView):
    @extend_schema(operation_id="admin_user_password", request=PasswordSerializer, responses=ChangedResponseSerializer)
    @_superuser_required
    def post(self, request, user_id):
        user = _get_user(user_id); denied = _protected_target(request, user)
        if denied: return denied
        serializer = PasswordSerializer(data=request.data)
        if not serializer.is_valid(): return _validation(serializer.errors)
        try: password_validation.validate_password(serializer.validated_data["password"], user)
        except Exception as exc: return _validation({"password": getattr(exc, "messages", [str(exc)])})
        with transaction.atomic():
            user.set_password(serializer.validated_data["password"]); user.save(update_fields=("password",))
            write_audit_log(action=AuditAction.USER_PASSWORD_RESET, object_type="user", object_id=str(user.pk), actor=request.user, metadata={"changed": True})
        return Response({"data": {"changed": True}})


class UserActivationView(APIView):
    @_superuser_required
    def post(self, request, user_id, active):
        user = _get_user(user_id); denied = _protected_target(request, user)
        if denied: return denied
        if user.pk == request.user.pk and not active:
            return error("self_lockout", "You cannot deactivate your own account.", 409)
        if user.is_active == active: return Response({"data": _user_data(user)})
        before = _audit_state(user)
        with transaction.atomic():
            user.is_active = active; user.save(update_fields=("is_active",))
            write_audit_log(action=AuditAction.USER_ACTIVATE if active else AuditAction.USER_DEACTIVATE, object_type="user", object_id=str(user.pk), actor=request.user, before=before, after=_audit_state(user))
        return Response({"data": _user_data(user)})


class UserActivateView(UserActivationView):
    @extend_schema(operation_id="admin_user_activate", request=None, responses=UserResponseSerializer)
    def post(self, request, user_id):
        return super().post(request, user_id, True)


class UserDeactivateView(UserActivationView):
    @extend_schema(operation_id="admin_user_deactivate", request=None, responses=UserResponseSerializer)
    def post(self, request, user_id):
        return super().post(request, user_id, False)
