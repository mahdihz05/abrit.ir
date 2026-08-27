from django.conf import settings
from django.db import models


class AccountSecurity(models.Model):
    """Persistent, per-account state used by the admin login boundary."""

    user = models.OneToOneField(settings.AUTH_USER_MODEL, on_delete=models.CASCADE, related_name="security")
    failed_attempts = models.PositiveSmallIntegerField(default=0)
    locked_until = models.DateTimeField(blank=True, null=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        verbose_name = "account security"
        verbose_name_plural = "account security"

    def __str__(self):
        return f"Security for {self.user.get_username()}"


class AdminCapability(models.Model):
    """A table-less owner for Phase 1 administrative capability permissions."""

    class Meta:
        managed = False
        default_permissions = ()
        permissions = (
            ("access_admin", "Can access the administration surfaces"),
            ("view_dashboard", "Can view the administration dashboard"),
            ("view_role_catalog", "Can view the fixed role catalog"),
        )
