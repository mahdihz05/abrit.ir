from __future__ import annotations

from ipaddress import ip_address

from django.conf import settings
from django.core.cache import cache
from django.db import transaction
from django.utils import timezone
from django.utils.timezone import timedelta

from apps.core.audit import AuditAction, write_audit_log

from .models import AccountSecurity


LOCKOUT_THRESHOLD = 5
LOCKOUT_DURATION = timedelta(minutes=15)


def client_ip(request) -> str:
    """Use forwarded client data only when the direct peer is trusted."""
    remote = request.META.get("REMOTE_ADDR", "")
    if remote not in set(getattr(settings, "TRUSTED_PROXY_IPS", ())):
        return remote or "unknown"
    forwarded = request.META.get("HTTP_X_FORWARDED_FOR", "")
    candidates = [value.strip() for value in forwarded.split(",") if value.strip()]
    candidate = candidates[0] if candidates else request.META.get("HTTP_X_REAL_IP", remote)
    try:
        return str(ip_address(candidate))
    except ValueError:
        return remote or "unknown"


def unknown_user_key(request, username: str) -> str:
    # Deliberately omit the username so this key cannot become an enumeration oracle.
    return f"abrit:admin-login:unknown:{client_ip(request)}"


def unknown_user_throttled(request, username: str) -> bool:
    try:
        key = unknown_user_key(request, username)
        count = cache.get(key)
        if count is None:
            cache.set(key, 1, timeout=60)
            return False
        cache.incr(key)
        return count + 1 >= 5
    except Exception:
        # Lockout and password verification remain effective during cache failure.
        return False


def account_security(user) -> AccountSecurity:
    security, _ = AccountSecurity.objects.get_or_create(user=user)
    return security


def record_unknown_login(*, request):
    return write_audit_log(
        action=AuditAction.AUTH_LOGIN_FAILURE,
        object_type="authentication", object_id="unknown", actor=None,
        metadata={"event": "authentication_failed", "ip": client_ip(request)},
    )


def is_locked(security: AccountSecurity) -> bool:
    return bool(security.locked_until and security.locked_until > timezone.now())


@transaction.atomic
def record_failed_login(user, *, request) -> AccountSecurity:
    security, _ = AccountSecurity.objects.select_for_update().get_or_create(user=user)
    now = timezone.now()
    if security.locked_until and security.locked_until <= now:
        security.failed_attempts = 0
        security.locked_until = None
    security.failed_attempts += 1
    if security.failed_attempts >= LOCKOUT_THRESHOLD:
        security.locked_until = now + LOCKOUT_DURATION
    security.save(update_fields=("failed_attempts", "locked_until", "updated_at"))
    write_audit_log(
        action=AuditAction.AUTH_LOGIN_FAILURE,
        object_type="user", object_id=str(user.pk), actor=user,
        metadata={"event": "account_locked" if security.locked_until else "authentication_failed", "ip": client_ip(request)},
    )
    return security


@transaction.atomic
def record_successful_login(user, *, request):
    security, _ = AccountSecurity.objects.select_for_update().get_or_create(user=user)
    security.failed_attempts = 0
    security.locked_until = None
    security.save(update_fields=("failed_attempts", "locked_until", "updated_at"))
    return write_audit_log(
        action=AuditAction.AUTH_LOGIN_SUCCESS,
        object_type="user", object_id=str(user.pk), actor=user,
        metadata={"event": "authentication_succeeded", "ip": client_ip(request)},
    )


@transaction.atomic
def unlock_account(user, *, actor=None):
    security, _ = AccountSecurity.objects.select_for_update().get_or_create(user=user)
    security.failed_attempts = 0
    security.locked_until = None
    security.save(update_fields=("failed_attempts", "locked_until", "updated_at"))
    return write_audit_log(
        action=AuditAction.AUTH_LOGIN_FAILURE,
        object_type="user", object_id=str(user.pk), actor=actor,
        metadata={"event": "account_unlocked"},
    )
