from django.contrib import admin

from .models import (
    AddonRate,
    ContractTerm,
    Package,
    PackageFeature,
    PackageFeatureTranslation,
    PackageFeatureValue,
    PackageTranslation,
)


class PackageTranslationInline(admin.StackedInline):
    model = PackageTranslation
    extra = 0


class AddonRateInline(admin.TabularInline):
    model = AddonRate
    extra = 0


class PackageFeatureValueInline(admin.TabularInline):
    model = PackageFeatureValue
    extra = 0
    autocomplete_fields = ("feature",)


@admin.register(Package)
class PackageAdmin(admin.ModelAdmin):
    inlines = (PackageTranslationInline, AddonRateInline, PackageFeatureValueInline)
    list_display = ("key", "order", "base_monthly_toman", "included_users", "included_endpoints", "is_featured", "is_active")
    list_filter = ("is_featured", "is_active")
    search_fields = ("key", "translations__name")
    ordering = ("order",)


class FeatureTranslationInline(admin.StackedInline):
    model = PackageFeatureTranslation
    extra = 0


@admin.register(PackageFeature)
class PackageFeatureAdmin(admin.ModelAdmin):
    inlines = (FeatureTranslationInline,)
    list_display = ("key", "order")
    search_fields = ("key", "translations__name")


@admin.register(ContractTerm)
class ContractTermAdmin(admin.ModelAdmin):
    list_display = ("months", "discount_bps", "onboarding_bps", "is_active")
