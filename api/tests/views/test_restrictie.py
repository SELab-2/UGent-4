from django.urls import reverse
from rest_framework.test import APITestCase, APIClient
from api.tests.factories.restrictie import RestrictieFactory
from api.tests.factories.project import ProjectFactory
from django.core.files.uploadedfile import SimpleUploadedFile
from rest_framework import status
from api.tests.factories.gebruiker import GebruikerFactory


class RestrictieListViewTest(APITestCase):
    def setUp(self):
        self.client = APIClient()
        self.restrictie = RestrictieFactory.create(moet_slagen=True)
        self.url = reverse("restrictie_list")
        self.teacher = GebruikerFactory.create(is_lesgever=True)
        self.client.force_login(self.teacher.user)

    def test_restrictie_list_get(self):
        response = self.client.get(self.url)
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(len(response.data), 1)

    def test_restrictie_list_get_project(self):
        response = self.client.get(
            self.url, {"project": self.restrictie.project.project_id}
        )
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(len(response.data), 1)
    
    def test_restrictie_list_get_project_invalid(self):
        response = self.client.get(self.url, {"project": 'invalid'})
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)

    def test_restrictie_list_get_moet_slagen(self):
        response = self.client.get(self.url, {"moet_slagen": "true"})
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(len(response.data), 1)
        response = self.client.get(self.url, {"moet_slagen": "false"})
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(len(response.data), 0)

    def test_restrictie_list_get_as_student(self):
        student = GebruikerFactory.create(is_lesgever=False)
        self.client.force_login(student.user)
        response = self.client.get(self.url)
        self.assertEqual(response.status_code, status.HTTP_403_FORBIDDEN)

    def test_restrictie_list_post(self):
        project = ProjectFactory.create()
        data = {
            "project": project.project_id,
            "script": SimpleUploadedFile("nieuw_script.sh", b"file_content"),
            "moet_slagen": False,
        }
        response = self.client.post(self.url, data, format="multipart")
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
    
    def test_restrictie_list_post_invalid(self):
        data = {
            "project": 'invalid',
            "script": SimpleUploadedFile("nieuw_script.sh", b"file_content"),
            "moet_slagen": False,
        }
        response = self.client.post(self.url, data, format="multipart")
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)


class RestrictieDetailViewTest(APITestCase):
    def setUp(self):
        self.client = APIClient()
        self.restrictie = RestrictieFactory.create()
        self.url = reverse(
            "restrictie_detail", kwargs={"id": self.restrictie.restrictie_id}
        )
        self.teacher = GebruikerFactory.create(is_lesgever=True)
        self.client.force_login(self.teacher.user)

    def test_restrictie_detail_get(self):
        response = self.client.get(self.url)
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(response.data["restrictie_id"], self.restrictie.restrictie_id)
    
    def test_restrictie_detail_get_invalid(self):
        response = self.client.get(reverse("restrictie_detail", kwargs={"id": 999}))
        self.assertEqual(response.status_code, status.HTTP_404_NOT_FOUND)

    def test_restrictie_detail_get_as_student(self):
        student = GebruikerFactory.create(is_lesgever=False)
        self.client.force_login(student.user)
        response = self.client.get(self.url)
        self.assertEqual(response.status_code, status.HTTP_403_FORBIDDEN)

    def test_restrictie_put(self):
        new_data = {
            "restrictie_id": self.restrictie.restrictie_id,
            "project": self.restrictie.project.project_id,
            "script": SimpleUploadedFile(self.restrictie.script.name, b"file_content"),
            "moet_slagen": not self.restrictie.moet_slagen,
        }
        response = self.client.put(self.url, new_data, format="multipart")
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(response.data["moet_slagen"], not self.restrictie.moet_slagen)
    
    def test_restrictie_put_invalid(self):
        new_data = {
            "restrictie_id": self.restrictie.restrictie_id,
            "project": self.restrictie.project.project_id,
            "script": SimpleUploadedFile(self.restrictie.script.name, b"file_content"),
            "moet_slagen": "invalid",
        }
        response = self.client.put(self.url, new_data, format="multipart")
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)

    def test_restrictie_put_as_student(self):
        student = GebruikerFactory.create(is_lesgever=False)
        self.client.force_login(student.user)
        new_data = {
            "restrictie_id": self.restrictie.restrictie_id,
            "project": self.restrictie.project.project_id,
            "script": SimpleUploadedFile(self.restrictie.script.name, b"file_content"),
            "moet_slagen": not self.restrictie.moet_slagen,
        }
        response = self.client.put(self.url, new_data, format="multipart")
        self.assertEqual(response.status_code, status.HTTP_403_FORBIDDEN)

    def test_restrictie_delete(self):
        response = self.client.delete(self.url)
        self.assertEqual(response.status_code, status.HTTP_204_NO_CONTENT)

    def test_restrictie_delete_as_student(self):
        student = GebruikerFactory.create(is_lesgever=False)
        self.client.force_login(student.user)
        response = self.client.delete(self.url)
        self.assertEqual(response.status_code, status.HTTP_403_FORBIDDEN)
