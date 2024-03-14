from django.urls import reverse
from rest_framework import status
from rest_framework.test import APITestCase
from api.tests.factories.vak import VakFactory
from api.tests.factories.gebruiker import GebruikerFactory
from rest_framework.test import APIClient


class VakListViewTest(APITestCase):
    def setUp(self):
        self.client = APIClient()
        self.gebruiker = GebruikerFactory.create(is_lesgever=True)
        self.studenten = GebruikerFactory.create_batch(3, is_lesgever=False)
        self.lesgevers = GebruikerFactory.create_batch(2, is_lesgever=True)
        self.client.force_authenticate(user=self.gebruiker.user)
        self.url = reverse("vak_list")

    def test_vak_list_get(self):
        response = self.client.get(self.url)
        self.assertEqual(response.status_code, status.HTTP_200_OK)

    def test_vak_list_post(self):
        data = {
            "naam": "test_name",
            "studenten": [student.user.id for student in self.studenten],
            "lesgevers": [lesgever.user.id for lesgever in self.lesgevers],
        }
        response = self.client.post(self.url, data)
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)


class VakDetailViewTest(APITestCase):
    def setUp(self):
        self.vak = VakFactory.create()
        self.client = APIClient()
        self.gebruiker = GebruikerFactory.create(is_lesgever=True)
        self.studenten = GebruikerFactory.create_batch(3, is_lesgever=False)
        self.lesgevers = GebruikerFactory.create_batch(2, is_lesgever=True)
        self.client.force_authenticate(user=self.gebruiker.user)
        self.url = reverse("vak_detail", args=[self.vak.vak_id])

    def test_vak_detail_get(self):
        response = self.client.get(reverse("vak_detail", args=[self.vak.pk]))
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(response.data["vak_id"], self.vak.vak_id)

    def test_vak_detail_put(self):
        data = {
            "vak_id": self.vak.vak_id,
            "naam": "nieuwe_vak_naam",
            "studenten": [student.user.id for student in self.studenten],
            "teachers": [teacher.user.id for teacher in self.lesgevers],
        }
        response = self.client.put(reverse("vak_detail", args=[self.vak.pk]), data)
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(response.data["naam"], data["naam"])

    def test_vak_detail_delete(self):
        response = self.client.delete(self.url)
        self.assertEqual(response.status_code, status.HTTP_204_NO_CONTENT)
