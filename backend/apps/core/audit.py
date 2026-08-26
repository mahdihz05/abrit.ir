"""Focused, explicit audit writes for Phase 1 domain services."""

from __future__ import annotations

from collections.abc import Mapping
from typing import Any

from django.core.exceptions import ValidationError

from .models import AuditLog


AuditActorType = AuditLog.ActorType
AuditAction = AuditLog.Action


REDACTED_VALUE = "[REDACTED]"
_SECRET_KEY_PARTS = frozenset(
    {"password", "passwd", "secret", "token", "cookie", "authorization", "apikey", "credential"}
)


def redact_secrets(value: Any) -> Any:
    """Return a recursively redacted copy suitable for a JSON audit field."""
    if isinstance(value, Mapping):
        return {
            str(key): REDACTED_VALUE if _is_secret_key(str(key)) else redact_secrets(item)
            for key, item in value.items()
        }
    if isinstance(value, (list, tuple)):
        return [redact_secrets(item) for item in value]
    return value


def write_audit_log(
    *,
    action: AuditAction | str,
    object_type: str,
    object_id: str,
    actor=None,
    actor_type: AuditActorType | str = AuditActorType.ADMIN,
    before: Mapping[str, Any] | list[Any] | None = None,
    after: Mapping[str, Any] | list[Any] | None = None,
    metadata: Mapping[str, Any] | list[Any] | None = None,
) -> AuditLog:
    """Create one validated, redacted audit record in the caller's transaction.

    This helper intentionally does not open its own transaction. Domain mutation
    services must call it inside their existing ``transaction.atomic`` block so
    that the mutation and its required audit record commit or roll back together.
    """
    action = _controlled_value(action, AuditAction, "action")
    actor_type = _controlled_value(actor_type, AuditActorType, "actor_type")
    if not object_type or not object_type.strip():
        raise ValidationError({"object_type": "An object type is required."})
    if not str(object_id):
        raise ValidationError({"object_id": "An object id is required."})

    return AuditLog.objects.create(
        actor=actor,
        actor_type=actor_type,
        action=action,
        object_type=object_type,
        object_id=str(object_id),
        before=redact_secrets(before or {}),
        after=redact_secrets(after or {}),
        metadata=redact_secrets(metadata or {}),
    )


def _controlled_value(value: AuditAction | AuditActorType | str, enum: type, field: str) -> str:
    try:
        return enum(value).value
    except ValueError as exc:
        allowed = ", ".join(item.value for item in enum)
        raise ValidationError({field: f"Unsupported value. Expected one of: {allowed}."}) from exc


def _is_secret_key(key: str) -> bool:
    normalized = "".join(character for character in key.lower() if character.isalnum())
    return any(part in normalized for part in _SECRET_KEY_PARTS)
