from django.shortcuts import get_object_or_404
from django.contrib.auth.models import User
from django.db.models import Q
from .models import Project, Task, Comment, Tag
from .serializers import (
    ProjectSerializer, 
    TaskSerializer, 
    CommentSerializer, 
    TagSerializer,
    )
from .permissions import IsProjectOwnerOrMember, IsProjectOwner, IsProjectOwnerCheck
from users.permissions import (
    IsAdmin,
    IsRegisteredUser,
    IsGuest
)
from rest_framework import viewsets, permissions, status
from rest_framework.decorators import api_view, permission_classes, authentication_classes
from rest_framework.response import Response
from rest_framework.throttling import UserRateThrottle
from rest_framework.reverse import reverse
from rest_framework_simplejwt.authentication import JWTAuthentication

class ProjectViewSet(viewsets.ModelViewSet):
    """
    This ViewSet automatically provides `list`, `create`, 
    `retrieve`, `update` and `destroy` actions.
    """
    queryset = Project.objects.all()
    serializer_class = ProjectSerializer
    permission_classes = [
        permissions.IsAuthenticated,
    ]
    authentication_classes = [JWTAuthentication]
    throttle_classes = [UserRateThrottle]

    def get_permissions(self):
        if self.action in ['create', 'update', 'destroy']:
            self.permission_classes = [permissions.IsAuthenticated, IsProjectOwner]
        else:
            self.permission_classes = [permissions.IsAuthenticated, IsProjectOwnerOrMember]
        return super().get_permissions()

    def get_queryset(self):
        user = self.request.user
        return Project.objects.filter(Q(owner=user) | Q(members=user)).distinct()

    def perform_create(self, serializer):
        serializer.save(owner=self.request.user)

    def perform_destroy(self, instance):
        # Ensure tasks are deleted before deleting the project
        instance.tasks.all().delete()
        instance.delete()

class TaskViewSet(viewsets.ModelViewSet):
    queryset = Task.objects.all()
    serializer_class = TaskSerializer
    permission_classes = [
        permissions.IsAuthenticated,
        IsProjectOwnerOrMember,
        IsProjectOwner
    ]
    authentication_classes = [JWTAuthentication]

    def get_queryset(self):
        project_id = self.kwargs.get('project_pk')
        task_id = self.kwargs.get('pk')
  
        if project_id and task_id:
            return Task.objects.filter(project_id=project_id, id=task_id)
        if project_id:
            return Task.objects.filter(project_id=project_id)
        return Task.objects.all()

    def perform_create(self, serializer):
        project_id = self.request.data.get('project')
        project = get_object_or_404(Project, id=project_id)
        serializer.save(project=project)

    def perform_destroy(self, instance):
        instance.delete()

class CommentViewSet(viewsets.ModelViewSet):
    queryset = Comment.objects.all()
    serializer_class = CommentSerializer
    permission_classes = [
        permissions.IsAuthenticated,
        IsProjectOwnerOrMember
    ]
    authentication_classes = [JWTAuthentication]

    def get_queryset(self):
        task_id = self.kwargs.get('task_pk')
        if task_id:
            return Comment.objects.filter(task_id=task_id)
        return Comment.objects.all()

    def perform_create(self, serializer):
        task_id = self.kwargs.get('task_pk')
        task = get_object_or_404(Task, id=task_id)
        serializer.save(author=self.request.user, task=task)

class TagViewSet(viewsets.ModelViewSet):
    queryset = Tag.objects.all()
    serializer_class = TagSerializer
    permission_classes = [
        permissions.IsAuthenticated,
        IsProjectOwnerOrMember
    ]
    authentication_classes = [JWTAuthentication]

    def get_queryset(self):
        task_id = self.kwargs.get('task_pk')
        if task_id:
            return Tag.objects.filter(task_id=task_id)
        return Tag.objects.all()
    
    def perform_create(self, serializer):
        task_id = self.kwargs.get('task_pk')
        task = get_object_or_404(Task, id=task_id)
        serializer.save(task=task)

class AllTagsViewSet(viewsets.ModelViewSet):
    queryset = Tag.objects.all()
    serializer_class = TagSerializer
    permission_classes = [
        permissions.IsAuthenticated,
        IsProjectOwnerOrMember
    ]
    authentication_classes = [JWTAuthentication]

    # This method allows the creation of tags
    def create(self, request, *args, **kwargs):
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        self.perform_create(serializer)
        headers = self.get_success_headers(serializer.data)
        return Response(serializer.data, status=status.HTTP_201_CREATED, headers = headers)
    
    def perform_create(self, serializer):
        serializer.save()

@api_view(['GET'])
@permission_classes([permissions.IsAuthenticated])
@authentication_classes([JWTAuthentication])
def check_permission(request, project_id):
    # Ensure user has permission before accessing the endpoint
    user = request.user

    try:
        project = Project.objects.get(id=project_id)

        if not IsProjectOwnerCheck().has_object_permission(request, None, project):
            return Response({'detail': 'Permission denied.'}, status=status.HTTP_403_FORBIDDEN)

        return Response({'detail': 'Permission granted.'}, status=status.HTTP_200_OK)

    except Project.DoesNotExist:
        return Response({'detail': 'Project not found.'}, status=status.HTTP_404_NOT_FOUND)
