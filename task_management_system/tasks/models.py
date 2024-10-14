from django.db import models
from users.models import CustomUser


class Project(models.Model):
    name = models.CharField(max_length=100)
    description = models.TextField(blank=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    owner = models.ForeignKey(CustomUser, related_name='owner_projects', on_delete=models.CASCADE)
    members = models.ManyToManyField(CustomUser, related_name='member_projects', blank=True)

    class Meta:
        ordering = ('name',)

    def __str__(self):
        return self.name


class Task(models.Model):
    project = models.ForeignKey(Project, related_name='tasks', on_delete=models.CASCADE)
    name = models.CharField(max_length=100)
    description = models.TextField(blank=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    due_date = models.DateTimeField(blank=True, null=True)
    assigned_to = models.ManyToManyField(CustomUser, related_name='assigned_tasks', blank=True)
    status = models.CharField(max_length=20, choices=[
        ('todo', 'To Do'),
        ('in_progress', 'In Progress'),
        ('completed', 'Completed')
    ], default='todo')
    tags = models.ManyToManyField('Tag', related_name='tagged_tasks', blank=True)

    class Meta:
        ordering = ('due_date', 'name')

    def __str__(self):
        return self.name


class Comment(models.Model):
    task = models.ForeignKey(Task, related_name='comments', on_delete=models.CASCADE)
    author = models.ForeignKey(CustomUser, related_name='user_comments', on_delete=models.CASCADE)
    content = models.TextField()
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        ordering = ('created_at',)

    def __str__(self):
        return f'Comment by {self.author.username} on {self.task.name}'


class Tag(models.Model):
    name = models.CharField(max_length=30, unique=True)
    tasks = models.ManyToManyField(Task, related_name='assigned_tags')

    class Meta:
        ordering = ('name',)

    def __str__(self):
        return self.name
