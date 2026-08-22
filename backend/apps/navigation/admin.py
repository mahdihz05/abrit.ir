from django.contrib import admin

from .models import Menu, MenuItem, MenuItemTranslation


class MenuItemTranslationInline(admin.StackedInline):
    model = MenuItemTranslation
    extra = 0


@admin.register(MenuItem)
class MenuItemAdmin(admin.ModelAdmin):
    inlines = (MenuItemTranslationInline,)
    list_display = ("menu", "parent", "order", "column", "internal_target", "external_url", "is_active")
    list_filter = ("menu", "is_active", "column")
    search_fields = ("translations__title", "external_url", "internal_target__key")
    autocomplete_fields = ("parent", "internal_target", "featured_image")


class MenuItemInline(admin.TabularInline):
    model = MenuItem
    fk_name = "menu"
    extra = 0
    show_change_link = True
    fields = ("parent", "internal_target", "external_url", "column", "order", "is_active")


@admin.register(Menu)
class MenuAdmin(admin.ModelAdmin):
    inlines = (MenuItemInline,)
    list_display = ("key", "location", "is_active", "updated_at")
    list_filter = ("location", "is_active")
    search_fields = ("key",)
