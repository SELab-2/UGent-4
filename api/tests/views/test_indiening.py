from django.test import TestCase
from api.tests.factories.indiening import IndieningFactory, IndieningBestandFactory
from api.tests.factories.gebruiker import GebruikerFactory
from rest_framework.test import APIClient
from django.urls import reverse
from rest_framework import status
from django.core.files.uploadedfile import SimpleUploadedFile


class IndieningListViewTest(TestCase):
    def setUp(self):
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

    def test_indiening_list_post(self):
        data = {
            "groep": self.indiening2.groep_id,
        }
        file1 = SimpleUploadedFile("file1.txt", b"file_content")
        file2 = SimpleUploadedFile("file2.txt", b"file_content")
        data["indiening_bestanden"] = [file1, file2]
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
    def setUp(self):
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
