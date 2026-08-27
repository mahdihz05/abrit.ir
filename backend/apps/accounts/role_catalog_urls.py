from django.urls import path

from .role_catalog_api import PermissionListView, RoleDetailView, RoleListView

urlpatterns = [
    path("roles", RoleListView.as_view(), name="admin-role-catalog-list"),
    path("roles/<slug:key>", RoleDetailView.as_view(), name="admin-role-catalog-detail"),
    path("permissions", PermissionListView.as_view(), name="admin-permission-catalog-list"),
]
