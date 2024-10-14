from .models import CustomUser
from rest_framework import serializers
from tasks.models import Project, Task, Comment, Tag
from users.serializers import UserSerializer


class TagSerializer(serializers.ModelSerializer):
    class Meta:
        model = Tag
        fields = ['id', 'name']


class TaskSerializer(serializers.ModelSerializer):
    tags = TagSerializer(many=True, read_only=True)
    tag_ids = serializers.PrimaryKeyRelatedField(queryset=Tag.objects.all(), many=True, required=False, allow_null=True, write_only=True)
    assigned_to = UserSerializer(many=True, read_only=True)  # Use UserSerializer for displaying members
    assigned_to_ids = serializers.PrimaryKeyRelatedField(queryset=CustomUser.objects.all(), many=True, required=False, allow_null=True, write_only=True)

    class Meta:
        model = Task
        fields = ['id', 'name', 'description', 'project', 'created_at',
                  'updated_at', 'due_date', 'assigned_to', 'assigned_to_ids',
                  'status', 'tags', 'tag_ids']

    def create(self, validated_data):
        tag_ids = validated_data.pop('tag_ids', [])
        assigned_to_ids = validated_data.pop('assigned_to_ids', [])
        task = Task.objects.create(**validated_data)
        task.tags.set(tag_ids)
        task.assigned_to.set(assigned_to_ids)
        return task

    def update(self, instance, validated_data):
        tag_ids = validated_data.pop('tag_ids', [])
        assigned_to_ids = validated_data.pop('assigned_to_ids', [])
        instance.name = validated_data.get('name', instance.name)
        instance.description = validated_data.get('description', instance.description)
        instance.due_date = validated_data.get('due_date', instance.due_date)
        instance.status = validated_data.get('status', instance.status)
        instance.save()
        instance.tags.set(tag_ids)
        instance.assigned_to.set(assigned_to_ids)
        return instance


class CommentSerializer(serializers.ModelSerializer):
    task = serializers.PrimaryKeyRelatedField(queryset=Task.objects.all())
    author = serializers.ReadOnlyField(source='author.username')

    class Meta:
        model = Comment
        fields = ['id', 'task', 'author', 'content', 'created_at', 'updated_at']


class ProjectSerializer(serializers.ModelSerializer):
    tasks = TaskSerializer(many=True, read_only=True)
    owner = serializers.ReadOnlyField(source='owner.username')
    members = UserSerializer(many=True, read_only=True)  # Use UserSerializer for displaying members
    member_ids = serializers.PrimaryKeyRelatedField(queryset=CustomUser.objects.all(), many=True, write_only=True)  # For creating/ updating members
    is_owner = serializers.SerializerMethodField()

    class Meta:
        model = Project
        fields = ['id', 'name', 'description', 'owner', 'created_at',
                  'updated_at', 'members', 'member_ids', 'tasks', 'is_owner']

    def get_is_owner(self, obj):
        request = self.context.get('request')
        return obj.owner == request.user

    def create(self, validated_data):
        member_ids = validated_data.pop('member_ids', [])  # Default to empty list if 'members' not provided
        project = Project.objects.create(**validated_data)
        project.members.set(member_ids)
        return project

    def update(self, instance, validated_data):
        member_ids = validated_data.pop('member_ids', [])  # Default to empty list if 'members' not provided
        instance.name = validated_data.get('name', instance.name)
        instance.description = validated_data.get('description', instance.description)
        instance.save()
        instance.members.set(member_ids)
        return instance
