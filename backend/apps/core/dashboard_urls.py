from django.urls import path

from .dashboard_api import DashboardView


urlpatterns = [
    path("dashboard", DashboardView.as_view(), name="admin-dashboard"),
]
