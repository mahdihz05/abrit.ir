from django.urls import include, path

from .auth_api import CsrfView, LoginView, LogoutView, SessionView

urlpatterns = [
    path("", include("apps.accounts.user_urls")),
    path("", include("apps.core.audit_urls")),
    path("", include("apps.core.dashboard_urls")),
    path("", include("apps.accounts.role_catalog_urls")),
    path("auth/csrf", CsrfView.as_view(), name="admin-auth-csrf"),
    path("auth/login", LoginView.as_view(), name="admin-auth-login"),
    path("auth/session", SessionView.as_view(), name="admin-auth-session"),
    path("auth/logout", LogoutView.as_view(), name="admin-auth-logout"),
]
