from django.urls import reverse
from rest_framework import status
from rest_framework.test import APIClient, APITestCase
from api.tests.factories.groep import GroepFactory
from api.tests.factories.gebruiker import GebruikerFactory


class GroepListViewTest(APITestCase):
    def setUp(self):
        self.gebruiker = GebruikerFactory.create(is_lesgever=True)
        self.url = reverse("groep_list")
        self.client = APIClient()
        self.client.force_authenticate(user=self.gebruiker.user)

    def test_groep_list_get(self):
        response = self.client.get(self.url)
        self.assertEqual(response.status_code, status.HTTP_200_OK)

    def test_groep_list_post(self):
        groep = GroepFactory.create()
        data = {
            "groep_id": groep.groep_id,
            "project": groep.project.project_id,
            "studenten": [],
        }
        response = self.client.post(self.url, data, format="json")
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)


class GroepDetailViewTest(APITestCase):
    def setUp(self):
        self.groep = GroepFactory.create()
        self.gebruiker = GebruikerFactory.create(is_lesgever=True)
        self.url = reverse("groep_detail", kwargs={"id": self.groep.groep_id})
        self.client = APIClient()
        self.client.force_authenticate(user=self.gebruiker.user)

    def test_groep_detail_get(self):
        response = self.client.get(self.url)
        self.assertEqual(response.status_code, status.HTTP_200_OK)

    def test_groep_detail_put(self):
        new_data = {
            "groep_id": self.groep.groep_id,
            "project": self.groep.project.project_id,
            "studenten": [],
        }
        response = self.client.put(self.url, new_data, format="json")
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.groep.refresh_from_db()
        self.assertEqual(set(self.groep.studenten.all()), set(new_data["studenten"]))

    def test_groep_detail_delete(self):
        response = self.client.delete(self.url)
        self.assertEqual(response.status_code, status.HTTP_204_NO_CONTENT)

    def test_get_invalid_groep(self):
        url = reverse("groep_detail", kwargs={"id": 10101})
        response = self.client.get(url)
        self.assertEqual(response.status_code, status.HTTP_404_NOT_FOUND)
