from django.db import models


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
