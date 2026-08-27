"""The narrow authorization boundary that content workflow services must enter."""

from contextlib import contextmanager
from contextvars import ContextVar


_workflow_transition_allowed = ContextVar("content_workflow_transition_allowed", default=False)


@contextmanager
def workflow_transition():
    """Permit a service-owned transition for the duration of its database write."""
    token = _workflow_transition_allowed.set(True)
    try:
        yield
    finally:
        _workflow_transition_allowed.reset(token)


def workflow_transition_allowed() -> bool:
    return _workflow_transition_allowed.get()
