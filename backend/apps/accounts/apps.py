from django.apps import AppConfig


class AccountsConfig(AppConfig):
    default_auto_field = "django.db.models.BigAutoField"
    name = "apps.accounts"
    verbose_name = "Accounts & roles"

    def ready(self):
        from . import admin  # noqa: F401
        from . import signals  # noqa: F401
