import pytest
from django.core.exceptions import ValidationError

from .models import DesignSettings, SiteSettings


@pytest.mark.django_db
def test_site_settings_is_a_singleton():
    SiteSettings.objects.create()
    with pytest.raises(ValidationError):
        SiteSettings.objects.create()


@pytest.mark.django_db
def test_design_settings_rejects_unsafe_geometry():
    design = DesignSettings(container_width=400)
    with pytest.raises(ValidationError):
        design.full_clean()
