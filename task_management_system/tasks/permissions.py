from rest_framework import permissions
from .models import Project, Task, Comment, Tag


class IsProjectOwnerCheck(permissions.BasePermission):
    """
    Custom permission to check if the user is the owner of the project.
    """
    def has_object_permission(self, request, view, obj):
        return request.user == obj.owner


class IsProjectOwner(permissions.BasePermission):
    """
    Custom permission to only allow project owners to create or edit tasks.
    """
    def has_object_permission(self, request, view, obj):
        if view.action in ['create', 'update', 'partial_update', 'destroy']:
            project = obj.project if hasattr(obj, 'project') else None
            if project:
                return request.user == project.owner
        return True


class IsProjectOwnerOrMember(permissions.BasePermission):
    """
    Custome permission to only allow project owners or members to
    access certain views and edit objects.
    """
    def has_object_permission(self, request, view, obj):
        # Read permissions are allowed to any request (GET, HEAD or OPTIONS request).
        if request.method in permissions.SAFE_METHODS:
            return self._is_owner_or_member(request.user, obj)

        # Write permissions are allowed to any request (POST, PUT, DELETE, etc.), restrict to owners
        if isinstance(obj, Project):
            # If obj is a Project, check if the user is the project owner
            is_owner = request.user == obj.owner
            return is_owner

        if isinstance(obj, Task):
            # If obj is a Task, check if the user is the project owner or member
            is_owner = request.user == obj.project.owner
            is_member = request.user in obj.project.members.all()
            return is_owner or is_member

        if isinstance(obj, Comment):
            # If obj is a Comment, check if the user is the project owner or member
            is_owner = request.user == obj.task.project.owner
            is_member = request.user in obj.task.project.members.all()
            return is_owner or is_member

        if isinstance(obj, Tag):
            # If obj is a Tag, check if the user is the project owner or member
            return self._can_view_and_modify_tag(request.user, obj)

        return False

    def _is_owner_or_member(self, user, obj):
        if isinstance(obj, Project):
            return user == obj.owner or user in obj.members.all()

        if isinstance(obj, Task):
            return user == obj.project.owner or user in obj.project.members.all()

        if isinstance(obj, Comment):
            return user == obj.task.project.owner or user in obj.task.project.members.all()

        if isinstance(obj, Tag):
            return self._can_view_and_modify_tag(user, obj)

        return False

    def _can_view_and_modify_tag(self, user, tag):
        # Allow view and modification if the user is an owner or member of
        # any of the projects associated with the tasks that use this tag
        for task in tag.tasks.all():
            if user == task.project.owner or user in task.project.members.all():
                return True

        return False
