from django.test import TestCase
from api.tests.factories.indiening import IndieningFactory
from api.tests.factories.gebruiker import GebruikerFactory
from rest_framework.test import APIClient
from django.urls import reverse
from rest_framework import status
from django.core.files.uploadedfile import SimpleUploadedFile
from django.core.files.base import ContentFile
from unittest.mock import patch


class IndieningListViewTest(TestCase):
    @patch("api.models.indiening.send_indiening_confirmation_mail")
    def setUp(self, mock_send_mail):
        self.client = APIClient()
        self.teacher = GebruikerFactory.create(is_lesgever=True)
        self.student = GebruikerFactory.create(is_lesgever=False)
        self.client.force_login(self.teacher.user)
        self.indiening1 = IndieningFactory.create()
        self.indiening2 = IndieningFactory.create()
        self.indiening1.groep.studenten.add(self.student)
        self.url = reverse("indiening_list")

    def test_indiening_list_get_as_teacher(self):
        response = self.client.get(self.url)
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(len(response.data), 2)

    def test_indiening_list_get_as_student(self):
        self.client.force_login(self.student.user)
        response = self.client.get(self.url)
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(len(response.data), 1)

    @patch("api.models.indiening.send_indiening_confirmation_mail")
    def test_indiening_list_post(self, mock_send_mail):
        data = {
            "groep": self.indiening2.groep_id,
        }
        file = SimpleUploadedFile("file1.txt", b"file_content")
        data["bestand"] = file
        response = self.client.post(self.url, data, format="multipart")
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        response = self.client.get(self.url)
        self.assertEqual(len(response.data), 3)

    def test_indiening_list_get_group(self):
        response = self.client.get(
            self.url, {"groep": self.indiening1.groep.groep_id}, format="json"
        )
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(len(response.data), 1)
        self.assertEqual(response.data[0]["groep"], self.indiening1.groep.groep_id)

    def test_indiening_list_get_groep_invalid(self):
        response = self.client.get(self.url, {"groep": "groep"}, format="json")
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)

    def test_indiening_list_get_project(self):
        response = self.client.get(
            self.url,
            {"project": self.indiening1.groep.project.project_id},
            format="json",
        )
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(len(response.data), 1)
        self.assertEqual(response.data[0]["groep"], self.indiening1.groep.groep_id)

    def test_indiening_list_get_project_invalid(self):
        response = self.client.get(self.url, {"project": "project"}, format="json")
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)

    def test_indiening_list_get_vak(self):
        response = self.client.get(
            self.url, {"vak": self.indiening1.groep.project.vak.vak_id}, format="json"
        )
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(len(response.data), 1)
        self.assertEqual(response.data[0]["groep"], self.indiening1.groep.groep_id)

    def test_indiening_list_get_project_vak(self):
        response = self.client.get(self.url, {"vak": "vak"}, format="json")
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)

    def test_indiening_list_post_no_files(self):
        data = {
            "groep": self.indiening2.groep_id,
        }
        response = self.client.post(self.url, data, format="multipart")
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)

    def test_indiening_list_post_invalid(self):
        data = {"groep": "groep"}
        file1 = SimpleUploadedFile("file1.txt", b"file_content")
        file2 = SimpleUploadedFile("file2.txt", b"file_content")
        data["indiening_bestanden"] = [file1, file2]
        response = self.client.post(self.url, data, format="multipart")
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)


class IndieningDetailViewTest(TestCase):
    @patch("api.models.indiening.send_indiening_confirmation_mail")
    def setUp(self, mock_send_mail):
        self.client = APIClient()
        self.gebruiker = GebruikerFactory.create()
        self.gebruiker.user.is_superuser = True
        self.gebruiker.user.save()
        self.indiening = IndieningFactory.create()
        self.client.force_login(self.gebruiker.user)
        self.url = reverse(
            "indiening_detail", kwargs={"id": self.indiening.indiening_id}
        )

    def test_indiening_detail_get(self):
        response = self.client.get(self.url)
        self.assertEqual(response.status_code, status.HTTP_200_OK)

    def test_indiening_detail_get_invalid(self):
        response = self.client.get(reverse("indiening_detail", kwargs={"id": 69}))
        self.assertEqual(response.status_code, status.HTTP_404_NOT_FOUND)

    def test_indiening_detail_get_unauthorized(self):
        gebruiker = GebruikerFactory.create(is_lesgever=False)
        self.client.force_login(gebruiker.user)
        response = self.client.get(self.url)
        self.assertEqual(response.status_code, status.HTTP_403_FORBIDDEN)

    def test_indiening_detail_delete(self):
        response = self.client.delete(self.url)
        self.assertEqual(response.status_code, status.HTTP_204_NO_CONTENT)

    def test_indiening_detail_delete_unauthorized(self):
        gebruiker = GebruikerFactory.create(is_lesgever=False)
        self.client.force_login(gebruiker.user)
        response = self.client.delete(self.url)
        self.assertEqual(response.status_code, status.HTTP_403_FORBIDDEN)


class IndieningDetailDownloadBestandenTest(TestCase):
    @patch("api.models.indiening.send_indiening_confirmation_mail")
    def setUp(self, mock_send_mail):
        self.client = APIClient()
        self.teacher = GebruikerFactory.create(is_lesgever=True)
        self.student = GebruikerFactory.create(is_lesgever=False)
        self.client.force_login(self.teacher.user)
        self.indiening = IndieningFactory.create()
        self.indiening.groep.studenten.add(self.student)
        self.url = reverse(
            "indiening_detail_download_bestanden",
            kwargs={"id": self.indiening.indiening_id},
        )

    def test_indiening_detail_download_bestanden_get_as_teacher(self):
        response = self.client.get(self.url)
        self.assertEqual(response.status_code, status.HTTP_200_OK)

    def test_indiening_detail_download_bestanden_get_as_student(self):
        self.client.force_login(self.student.user)
        response = self.client.get(self.url)
        self.assertEqual(response.status_code, status.HTTP_200_OK)

    def test_indiening_detail_download_bestanden_get_unauthorized(self):
        student = GebruikerFactory.create(is_lesgever=False)
        self.client.force_login(student.user)
        response = self.client.get(self.url)
        self.assertEqual(response.status_code, status.HTTP_403_FORBIDDEN)

    def test_indiening_detail_download_bestanden_get_invalid(self):
        self.url = reverse("indiening_detail_download_bestanden", kwargs={"id": 69})
        response = self.client.get(self.url)
        self.assertEqual(response.status_code, status.HTTP_404_NOT_FOUND)


class IndieningDetailDownloadArtefactenTest(TestCase):
    @patch("api.models.indiening.send_indiening_confirmation_mail")
    def setUp(self, mock_send_mail):
        self.client = APIClient()
        self.teacher = GebruikerFactory.create(is_lesgever=True)
        self.student = GebruikerFactory.create(is_lesgever=False)
        self.client.force_login(self.teacher.user)
        self.indiening = IndieningFactory.create()
        self.indiening.groep.studenten.add(self.student)
        self.url = reverse(
            "indiening_detail_download_artefacten",
            kwargs={"id": self.indiening.indiening_id},
        )

    def test_indiening_detail_download_artefacten_get_invalid_as_teacher(self):
        response = self.client.get(self.url)
        self.assertEqual(response.status_code, status.HTTP_404_NOT_FOUND)

    def test_indiening_detail_download_artefacten_get_as_teacher(self):
        content = b"Some file content"
        file_content = ContentFile(
            content,
            name="data/indieningen/indiening_{self.indiening.indiening_id}/artefacten.zip",
        )
        self.indiening.artefacten.save(file_content.name, file_content)
        self.indiening.save()
        response = self.client.get(self.url)
        self.assertEqual(response.status_code, status.HTTP_200_OK)

    def test_indiening_detail_download_artefacten_get_as_student(self):
        self.client.force_login(self.student.user)
        response = self.client.get(self.url)
        self.assertEqual(response.status_code, status.HTTP_403_FORBIDDEN)

    def test_indiening_detail_download_artefacten_get_invalid(self):
        self.url = reverse("indiening_detail_download_artefacten", kwargs={"id": 69})
        response = self.client.get(self.url)
        self.assertEqual(response.status_code, status.HTTP_404_NOT_FOUND)
