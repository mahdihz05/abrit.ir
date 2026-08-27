from django.urls import path

from .auth_api import CsrfView, LoginView, LogoutView, SessionView

urlpatterns = [
    path("auth/csrf", CsrfView.as_view(), name="admin-auth-csrf"),
    path("auth/login", LoginView.as_view(), name="admin-auth-login"),
    path("auth/session", SessionView.as_view(), name="admin-auth-session"),
    path("auth/logout", LogoutView.as_view(), name="admin-auth-logout"),
]
