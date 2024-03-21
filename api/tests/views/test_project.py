from django.urls import reverse
from rest_framework import status
from rest_framework.test import APITestCase
from api.tests.factories.project import ProjectFactory
from api.tests.factories.vak import VakFactory
from api.tests.factories.gebruiker import GebruikerFactory
from rest_framework.test import APIClient
from django.core.files.uploadedfile import SimpleUploadedFile


class ProjectListViewTest(APITestCase):
    def setUp(self):
        self.teacher = GebruikerFactory.create(is_lesgever=True)
        self.student = GebruikerFactory.create(is_lesgever=False)
        self.project1 = ProjectFactory.create()
        self.project2 = ProjectFactory.create(zichtbaar=True, gearchiveerd=False)
        self.project2.vak.studenten.add(self.student)
        self.url = reverse("project_list")
        self.client = APIClient()
        self.client.force_login(self.teacher.user)

    def test_project_list_get_as_teacher(self):
        response = self.client.get(self.url)
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(len(response.data), 2)

    def test_project_list_get_as_student(self):
        self.client.force_login(self.student.user)
        response = self.client.get(self.url)
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(len(response.data), 1)
        self.assertEqual(response.data[0]["project_id"], self.project2.project_id)

    def test_project_list_get_vak(self):
        response = self.client.get(self.url, {"vak": self.project1.vak.vak_id})
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(len(response.data), 1)
        self.assertEqual(response.data[0]["project_id"], self.project1.project_id)

    def test_project_list_get_vak_invalid(self):
        response = self.client.get(self.url, {"vak": "vak"})
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)

    def test_project_list_post(self):
        vak = VakFactory.create().vak_id
        data = {
            "titel": "test project",
            "beschrijving": "Dit is een test project.",
            "opgave_bestand": SimpleUploadedFile("file.txt", b"file_content"),
            "vak": vak,
            "deadline": "2024-03-31T12:40:05.317980Z",
            "extra_deadline": "",
            "max_score": 20,
            "zichtbaar": "true",
            "gearchiveerd": "false",
        }
        response = self.client.post(self.url, data, format="multipart")
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)

    def test_project_list_post_unauthorized(self):
        self.client.force_login(self.student.user)
        vak = VakFactory.create().vak_id
        data = {
            "titel": "test project",
            "beschrijving": "Dit is een test project.",
            "opgave_bestand": SimpleUploadedFile("file.txt", b"file_content"),
            "vak": vak,
            "deadline": "2024-03-31T12:40:05.317980Z",

            "max_score": 20,
            "zichtbaar": "true",
            "gearchiveerd": "false",
        }
        response = self.client.post(self.url, data, format="multipart")
        self.assertEqual(response.status_code, status.HTTP_403_FORBIDDEN)

    def test_project_list_post_invalid(self):
        data = {
            "titel": "test project",
            "beschrijving": "Dit is een test project.",
            "opgave_bestand": "bestand",
            "vak": "vak",
            "deadline": "2024-03-31T12:40:05.317980Z",
            "extra_deadline": "2024-03-31T12:40:05.317980Z",
            "max_score": 20,
            "zichtbaar": "true",
            "gearchiveerd": "false",
        }
        response = self.client.post(self.url, data, format="multipart")
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)


class ProjectDetailViewTest(APITestCase):
    def setUp(self):
        self.project = ProjectFactory.create()
        self.teacher = GebruikerFactory.create(is_lesgever=True)
        self.student = GebruikerFactory.create(is_lesgever=False)
        self.project.vak.studenten.add(self.student)
        self.url = reverse("project_detail", kwargs={"id": self.project.project_id})
        self.client = APIClient()
        self.client.force_login(self.teacher.user)

    def test_project_detail_get_as_teacher(self):
        response = self.client.get(self.url)
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(response.data["project_id"], self.project.project_id)

    def test_project_detail_get_as_student(self):
        self.client.force_login(self.student.user)
        response = self.client.get(self.url)
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(response.data["project_id"], self.project.project_id)

    def test_project_detail_get_unauthorized(self):
        student = GebruikerFactory.create(is_lesgever=False)
        self.client.force_login(student.user)
        response = self.client.get(self.url)
        self.assertEqual(response.status_code, status.HTTP_403_FORBIDDEN)

    def test_invalid_project_detail_get(self):
        response = self.client.get(reverse("project_detail", kwargs={"id": 69}))
        self.assertEqual(response.status_code, status.HTTP_404_NOT_FOUND)

    def test_project_detail_put(self):
        new_data = {
            "project_id": self.project.project_id,
            "titel": self.project.titel,
            "beschrijving": "Aangepaste beschrijving",
            "opgave_bestand": self.project.opgave_bestand,
            "vak": self.project.vak.vak_id,
            "deadline": self.project.deadline,
            "extra_deadline": self.project.extra_deadline,
            "max_score": self.project.max_score,
            "zichtbaar": self.project.zichtbaar,
            "gearchiveerd": self.project.gearchiveerd,
        }
        response = self.client.put(self.url, new_data, format="multipart")
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.project.refresh_from_db()
        self.assertEqual(self.project.titel, new_data["titel"])
        self.assertEqual(self.project.beschrijving, new_data["beschrijving"])

    def test_project_detail_put_invalid(self):
        new_data = {
            "project_id": self.project.project_id,
            "titel": self.project.titel,
            "beschrijving": "Aangepaste beschrijving",
            "opgave_bestand": "bestand",
            "vak": self.project.vak.vak_id,
            "deadline": self.project.deadline,
            "extra_deadline": self.project.extra_deadline,
            "max_score": self.project.max_score,
            "zichtbaar": self.project.zichtbaar,
            "gearchiveerd": self.project.gearchiveerd,
        }
        response = self.client.put(self.url, new_data, format="multipart")
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)

    def test_project_detail_put_unauthorized(self):
        student = GebruikerFactory.create(is_lesgever=False)
        self.client.force_login(student.user)
        new_data = {
            "project_id": self.project.project_id,
            "titel": self.project.titel,
            "beschrijving": "Aangepaste beschrijving",
            "opgave_bestand": "bestand",
            "vak": self.project.vak.vak_id,
            "deadline": self.project.deadline,
            "extra_deadline": self.project.extra_deadline,
            "max_score": self.project.max_score,
            "zichtbaar": "true",
            "gearchiveerd": "false",
        }
        response = self.client.put(self.url, new_data, format="multipart")
        self.assertEqual(response.status_code, status.HTTP_403_FORBIDDEN)

    def test_project_detail_delete(self):
        response = self.client.delete(self.url)
        self.assertEqual(response.status_code, status.HTTP_204_NO_CONTENT)

    def test_project_detail_delete_unauthorized(self):
        student = GebruikerFactory.create(is_lesgever=False)
        self.client.force_login(student.user)
        response = self.client.delete(self.url)
        self.assertEqual(response.status_code, status.HTTP_403_FORBIDDEN)
