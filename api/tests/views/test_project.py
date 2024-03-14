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
        self.gebruiker = GebruikerFactory.create(is_lesgever=True)
        self.url = reverse("project_list")
        self.client = APIClient()
        self.client.force_authenticate(user=self.gebruiker.user)

    def test_project_list_get(self):
        response = self.client.get(self.url)
        self.assertEqual(response.status_code, status.HTTP_200_OK)

    def test_project_list_post(self):
        vak = VakFactory.create().vak_id
        data = {
            "titel": "test project",
            "beschrijving": "Dit is een test project.",
            "opgave_bestand": SimpleUploadedFile("file.txt", b"file_content"),
            "vak": vak,
            "deadline": "2024-03-31T12:40:05.317980Z",
            "max_score": 20,
        }
        response = self.client.post(self.url, data, format="multipart")
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)


class ProjectDetailViewTest(APITestCase):
    def setUp(self):
        self.project = ProjectFactory.create()
        self.gebruiker = GebruikerFactory.create(is_lesgever=True)
        self.url = reverse("project_detail", kwargs={"id": self.project.project_id})
        self.client = APIClient()
        self.client.force_authenticate(user=self.gebruiker.user)

    def test_project_detail_get(self):
        response = self.client.get(self.url)
        self.assertEqual(response.status_code, status.HTTP_200_OK)

    def test_invalid_project_detail_get(self):
        url = reverse("project_detail", kwargs={"id": "9999999"})
        response = self.client.get(url)
        self.assertEqual(response.status_code, status.HTTP_404_NOT_FOUND)

    def test_project_detail_put(self):
        new_data = {
            "project_id": self.project.project_id,
            "titel": self.project.titel,
            "beschrijving": "Aangepaste beschrijving",
            "opgave_bestand": self.project.opgave_bestand,
            "vak": self.project.vak.vak_id,
            "deadline": self.project.deadline,
            "max_score": self.project.max_score,
        }
        response = self.client.put(self.url, new_data, format="multipart")
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.project.refresh_from_db()
        self.assertEqual(self.project.titel, new_data["titel"])
        self.assertEqual(self.project.beschrijving, new_data["beschrijving"])

    def test_project_detail_delete(self):
        response = self.client.delete(self.url)
        self.assertEqual(response.status_code, status.HTTP_204_NO_CONTENT)
