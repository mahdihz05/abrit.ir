from django.urls import path

from .audit_api import AuditDetailView, AuditListView


urlpatterns = [
    path("audit", AuditListView.as_view(), name="admin-audit-list"),
    path("audit/<uuid:audit_id>", AuditDetailView.as_view(), name="admin-audit-detail"),
]
