from __future__ import annotations

from functools import wraps

from django.contrib.auth import authenticate, login, logout
from django.contrib.auth.models import User
from django.middleware.csrf import get_token
from django.utils.decorators import method_decorator
from django.views.decorators.csrf import csrf_protect
from drf_spectacular.utils import extend_schema
from rest_framework import serializers
from rest_framework.permissions import AllowAny
from rest_framework.response import Response
from rest_framework.views import APIView

from .roles import fixed_role_for_user
from .models import AccountSecurity
from .security import (
    is_locked, record_failed_login, record_successful_login,
    record_unknown_login, unknown_user_throttled,
)


class LoginRequestSerializer(serializers.Serializer):
    username = serializers.CharField()
    password = serializers.CharField(write_only=True)


class CsrfDataSerializer(serializers.Serializer):
    csrf_token = serializers.CharField()


class CsrfResponseSerializer(serializers.Serializer):
    data = CsrfDataSerializer()


class SessionDataSerializer(serializers.Serializer):
    user = serializers.JSONField()


class SessionResponseSerializer(serializers.Serializer):
    data = SessionDataSerializer()


class EmptyResponseSerializer(serializers.Serializer):
    data = serializers.JSONField(allow_null=True)


def error(code, detail, status):
    return Response({"error": {"status": status, "code": code, "detail": detail}}, status=status)


def session_user(user):
    role = fixed_role_for_user(user)
    permissions = sorted(user.get_all_permissions())
    return {
        "id": user.pk, "username": user.username, "email": user.email,
        "first_name": user.first_name, "last_name": user.last_name,
        "is_superuser": user.is_superuser,
        "role": {"key": role.key, "name": role.name} if role else None,
        "permissions": permissions,
    }


def admin_session_required(view):
    @wraps(view)
    def wrapped(self, request, *args, **kwargs):
        user = request.user
        if not user.is_authenticated or not user.is_active:
            return error("session_expired", "Your admin session has expired.", 401)
        if not (user.is_superuser or user.has_perm("accounts.access_admin")):
            return error("admin_access_denied", "You are not allowed to access the administration API.", 403)
        return view(self, request, *args, **kwargs)
    return wrapped


class CsrfView(APIView):
    permission_classes = [AllowAny]

    @extend_schema(operation_id="admin_auth_csrf", responses=CsrfResponseSerializer)
    def get(self, request):
        return Response({"data": {"csrf_token": get_token(request)}})


class LoginView(APIView):
    permission_classes = [AllowAny]

    @extend_schema(operation_id="admin_auth_login", request=LoginRequestSerializer, responses=SessionResponseSerializer)
    @method_decorator(csrf_protect)
    def post(self, request):
        username = request.data.get("username", "")
        password = request.data.get("password", "")
        user = User.objects.filter(username=username).first()
        if user is None:
            if unknown_user_throttled(request, username):
                return error("login_throttled", "Too many login attempts. Try again later.", 429)
            record_unknown_login(request=request)
            return error("authentication_failed", "Invalid username or password.", 401)
        security = AccountSecurity.objects.filter(user=user).first()
        if security and is_locked(security):
            if user.check_password(password):
                return error("account_locked", "This account is temporarily locked.", 403)
            return error("authentication_failed", "Invalid username or password.", 401)
        authenticated = authenticate(request, username=username, password=password)
        if authenticated is None or not user.is_active:
            record_failed_login(user, request=request)
            return error("authentication_failed", "Invalid username or password.", 401)
        if not (user.is_superuser or user.has_perm("accounts.access_admin")):
            return error("admin_access_denied", "You are not allowed to access the administration API.", 403)
        record_successful_login(user, request=request)
        login(request, user)
        return Response({"data": {"user": session_user(user)}})


class SessionView(APIView):
    @extend_schema(operation_id="admin_auth_session", responses=SessionResponseSerializer)
    @admin_session_required
    def get(self, request):
        return Response({"data": {"user": session_user(request.user)}})


class LogoutView(APIView):
    @extend_schema(operation_id="admin_auth_logout", request=None, responses=EmptyResponseSerializer)
    @method_decorator(csrf_protect)
    @admin_session_required
    def post(self, request):
        logout(request)
        return Response({"data": None})
