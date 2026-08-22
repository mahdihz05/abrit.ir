"""
URL configuration for config project.

The `urlpatterns` list routes URLs to views. For more information please see:
    https://docs.djangoproject.com/en/5.2/topics/http/urls/
Examples:
Function views
    1. Add an import:  from my_app import views
    2. Add a URL to urlpatterns:  path('', views.home, name='home')
Class-based views
    1. Add an import:  from other_app.views import Home
    2. Add a URL to urlpatterns:  path('', Home.as_view(), name='home')
Including another URLconf
    1. Import the include() function: from django.urls import include, path
    2. Add a URL to urlpatterns:  path('blog/', include('blog.urls'))
"""
from django.conf import settings
from django.conf.urls.static import static
from django.contrib import admin
from django.urls import path
from drf_spectacular.views import SpectacularAPIView, SpectacularSwaggerView

from apps.content.api import ContentDetailView, ContentListView, RootContentDetailView
from apps.core.api import SiteSettingsView, health
from apps.forms.api import admin_submission_file_download
from apps.navigation.api import NavigationView
from apps.pricing.api import PackageListView, PricingCalculateView
from apps.search.api import SearchView

urlpatterns = [
    path("admin/forms/submission-file/<uuid:file_id>/download/", admin_submission_file_download, name="admin-submission-file-download"),
    path("admin/", admin.site.urls),
    path("health/", health, name="health"),
    path("api/schema/", SpectacularAPIView.as_view(), name="schema"),
    path("api/docs/", SpectacularSwaggerView.as_view(url_name="schema"), name="api-docs"),
    path("api/v1/site/settings", SiteSettingsView.as_view(), name="site-settings"),
    path("api/v1/navigation/<str:location>/<str:locale>", NavigationView.as_view(), name="navigation"),
    path("api/v1/content/collections/<str:kind>/<str:locale>", ContentListView.as_view(), name="content-list"),
    path("api/v1/content/<str:locale>/root", RootContentDetailView.as_view(), name="content-root"),
    path("api/v1/content/<str:locale>/<path:path>", ContentDetailView.as_view(), name="content-detail"),
    path("api/v1/pricing/packages", PackageListView.as_view(), name="package-list"),
    path("api/v1/pricing/calculate", PricingCalculateView.as_view(), name="pricing-calculate"),
    path("api/v1/search", SearchView.as_view(), name="search"),
]

if settings.DEBUG:
    urlpatterns += static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)
