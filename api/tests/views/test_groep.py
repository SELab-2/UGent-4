from django.urls import reverse
from rest_framework import status
from rest_framework.test import APIClient, APITestCase
from api.tests.factories.groep import GroepFactory


class GroepListViewTest(APITestCase):
    def setUp(self):
        self.client = APIClient()

    def test_get_groep_list(self):
        response = self.client.get("/api/groepen/")
        self.assertEqual(response.status_code, status.HTTP_200_OK)

    def test_post_groep_list(self):
        groep = GroepFactory.create()
        data = {
            "groep": groep.groep_id,
            "project": groep.project.project_id,
            "studenten": [],
        }
        response = self.client.post("/api/groepen/", data)
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)


class GroepDetailViewTest(APITestCase):
    def setUp(self):
        self.client = APIClient()
        self.groep = GroepFactory.create()
        self.url = reverse("groep_detail", kwargs={"id": self.groep.groep_id})

    def test_get_groep_detail(self):
        response = self.client.get(self.url)
        self.assertEqual(response.status_code, status.HTTP_200_OK)

    def test_get_invalid_groep(self):
        url = reverse("groep_detail", kwargs={"id": 10101})
        response = self.client.get(url)
        self.assertEqual(response.status_code, status.HTTP_404_NOT_FOUND)
