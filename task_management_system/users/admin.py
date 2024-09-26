from django.contrib import admin
from .models import CustomUser

@admin.register(CustomUser)
class CustomUserAdmin(admin.ModelAdmin):
    list_display = [
        'email',
        'first_name',
        'last_name',
        'role',
        'is_staff',
        'is_active'
    ]
    actions = ['make_admin', 'make_project_owner', 'make_member', 'make_guest']

    def make_admin(self, request, queryset):
        queryset.update(role=CustomUser.ADMIN)
    make_admin.short_description = "Change role to Admin"

    def make_project_owner(self, request, queryset):
        queryset.update(role=CustomUser.PROJECT_OWNER)
    make_project_owner.short_description = "Change role to Project Owner"

    def make_member(self, request, queryset):
        queryset.update(role=CustomUser.MEMBER)
    make_member.short_description = "Change role to Project Member"

    def make_guest(self, request, queryset):
        queryset.update(role=CustomUser.GUEST)
    make_guest.short_description = "Change role to Guest"
