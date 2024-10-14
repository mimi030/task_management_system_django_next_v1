from rest_framework import permissions
from .models import CustomUser


class IsAdmin(permissions.BasePermission):
    """
    Custom permission to allow admin to access
    """
    def has_permission(self, request, view):
        return request.user.is_authenticated and request.user.role == CustomUser.ADMIN


class IsRegisteredUser(permissions.BasePermission):
    """
    Custom permission to only allow registered users to access certain views.
    """
    def has_object_permission(self, request, view, obj):
        # Read permissions are allowed to any request from registered users,
        # so we'll always allow GET, HEAD or OPTIONS request.
        if request.method in permissions.SAFE_METHODS:
            return True


class IsGuest(permissions.BasePermission):
    """
    Custom permission to allow guests to access certain views.
    Guests can only view and create comments
    """
    def has_permission(self, request, view):
        return request.user.is_authenticated and request.user.role == CustomUser.GUEST
