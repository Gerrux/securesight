from django.contrib import admin
from django.contrib.auth.admin import UserAdmin as BaseUserAdmin

from .models import CustomUser


class CustomUserAdmin(BaseUserAdmin):
    fieldsets = (
        (None, {'fields': ('email', 'username', 'password')}),
        ('Permissions', {'fields': ('is_active', 'is_staff')}),
    )
    add_fieldsets = (
        (None, {
            'classes': ('wide',),
            'fields': ('email', 'username', 'password1', 'password2'),
        }),
    )
    list_display = ('username', 'email', 'is_staff')
    search_fields = ('email', 'username')
    ordering = ('username',)

    # Удалим filter_horizontal и list_filter
    filter_horizontal = ()
    list_filter = ('is_active', 'is_staff')


admin.site.register(CustomUser, CustomUserAdmin)
