# tasks/tests/test_models.py
from rest_framework.test import APITestCase
from rest_framework_simplejwt.tokens import RefreshToken
from django.urls import reverse
from users.models import CustomUser
from tasks.models import Project


class ProjectViewSetTest(APITestCase):
    def setUp(self):
        self.user = CustomUser.objects.create_user(
            username='testuser',
            password='testpassword',
            email='testuser@example.com',
        )
        self.user.save()

        # Generate JWT token
        self.refresh = RefreshToken.for_user(self.user)
        self.client.credentials(HTTP_AUTHORIZATION=f'Bearer {self.refresh.access_token}')

        # Create projects owned by the user
        self.project1 = Project.objects.create(owner=self.user, name="Project 1")
        self.project2 = Project.objects.create(owner=self.user, name="Project 2")

    def test_project_owner_can_see_own_projects(self):
        url = reverse('project-list')
        response = self.client.get(url)
        print(response.data)
        print(response.status_code)
        self.assertEqual(response.status_code, 200)
        self.assertEqual(len(response.data), 2)  # Assuming the owner should see 2 projects

    def test_project_owner_cannot_see_other_users_projects(self):
        other_user = CustomUser.objects.create_user(
            username='otheruser',
            password='otherpassword',
            email='otheruser@example.com',
        )
        other_project = Project.objects.create(owner=other_user, name="Other User's Project")

        url = reverse('project-list')
        response = self.client.get(url)
        self.assertEqual(response.status_code, 200)
        project_ids = [project['id'] for project in response.data]
        self.assertNotIn(other_project.id, project_ids)
