from rest_framework.test import APIClient, APITestCase
from api.tests.factories.gebruiker import GebruikerFactory
from django.urls import reverse
from rest_framework import status


class GebruikerListViewTest(APITestCase):
    def setUp(self):
        self.gebruiker = GebruikerFactory.create()
        self.url = reverse("gebruiker_list")
        self.client = APIClient()
        self.client.force_authenticate(user=self.gebruiker.user)

    def test_gebruiker_list_get(self):
        response = self.client.get(self.url)
        self.assertEqual(response.status_code, status.HTTP_200_OK)


class GebruikerDetailViewTest(APITestCase):
    def setUp(self):
        self.gebruiker = GebruikerFactory.create()
        self.gebruiker.user.is_superuser = True
        self.gebruiker.user.save()
        self.client = APIClient()
        self.client.force_authenticate(user=self.gebruiker.user)
        self.url = reverse("gebruiker_detail", kwargs={"id": self.gebruiker.user.id})

    def test_gebruiker_detail_get(self):
        response = self.client.get(self.url)
        self.assertEqual(response.status_code, status.HTTP_200_OK)

    def test_gebruiker_detail_put(self):
        new_data = {
            "user": self.gebruiker.user.id,
            "is_lesgever": not self.gebruiker.is_lesgever,
        }
        response = self.client.put(self.url, new_data, format="json")
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.gebruiker.refresh_from_db()
        self.assertEqual(self.gebruiker.is_lesgever, new_data["is_lesgever"])
