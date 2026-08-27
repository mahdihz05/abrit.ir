"""Single protected Admin API URL aggregator.

Feature modules are included exactly once below the R05 auth boundary. Keep
their route names local to the modules so the central URL resolver remains the
only integration point.
"""

from django.urls import include, path

from .auth_api import CsrfView, LoginView, LogoutView, SessionView

protected_feature_urlpatterns = [
    path("", include("apps.accounts.user_urls")),
    path("", include("apps.core.audit_urls")),
    path("", include("apps.core.dashboard_urls")),
    path("", include("apps.accounts.role_catalog_urls")),
]

urlpatterns = [
    *protected_feature_urlpatterns,
    path("auth/csrf", CsrfView.as_view(), name="admin-auth-csrf"),
    path("auth/login", LoginView.as_view(), name="admin-auth-login"),
    path("auth/session", SessionView.as_view(), name="admin-auth-session"),
    path("auth/logout", LogoutView.as_view(), name="admin-auth-logout"),
]
