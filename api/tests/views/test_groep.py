from django.urls import reverse
from rest_framework import status
from rest_framework.test import APIClient, APITestCase
from api.tests.factories.groep import GroepFactory
from api.tests.factories.gebruiker import GebruikerFactory
from api.models.groep import Groep


class GroepListViewTest(APITestCase):
    def setUp(self):
        self.student = GebruikerFactory.create(is_lesgever=False)
        self.teacher = GebruikerFactory.create(is_lesgever=True)
        self.groep1 = GroepFactory.create()
        self.groep2 = GroepFactory.create()
        self.groep1.studenten.add(self.student)
        self.url = reverse("groep_list")
        self.client = APIClient()
        self.client.force_login(self.teacher.user)

    def test_groep_list_get_as_teacher(self):
        response = self.client.get(self.url)
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(len(response.data), 2)

    def test_groep_list_get_as_student(self):
        self.client.force_login(self.student.user)
        response = self.client.get(self.url)
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(len(response.data), Groep.objects.count())
        self.assertEqual(response.data[0]["groep_id"], self.groep1.groep_id)

    def test_groep_list_get_project(self):
        response = self.client.get(
            self.url, {"project": self.groep1.project.project_id}, format="json"
        )
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(len(response.data), 1)
        self.assertEqual(response.data[0]["groep_id"], self.groep1.groep_id)

    def test_groep_list_get_invalid_project(self):
        response = self.client.get(self.url, {"project": "project"}, format="json")
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)

    def test_groep_list_get_student(self):
        response = self.client.get(
            self.url, {"student": self.student.user.id}, format="json"
        )
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(len(response.data), 1)
        self.assertEqual(response.data[0]["groep_id"], self.groep1.groep_id)

    def test_groep_list_get_invalid_student(self):
        response = self.client.get(self.url, {"student": "student"}, format="json")
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)

    def test_groep_list_post(self):
        groep = GroepFactory.create()
        data = {
            "groep_id": groep.groep_id,
            "project": groep.project.project_id,
            "studenten": [],
        }
        response = self.client.post(self.url, data, format="json")
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)

    def test_groep_list_post_unauthorized(self):
        self.client.force_login(self.student.user)
        groep = GroepFactory.create()
        data = {
            "groep_id": groep.groep_id,
            "project": groep.project.project_id,
            "studenten": [],
        }
        response = self.client.post(self.url, data, format="json")
        self.assertEqual(response.status_code, status.HTTP_403_FORBIDDEN)

    def test_groep_list_post_invalid(self):
        data = {
            "groep_id": self.groep1.groep_id,
            "project": 69,
            "studenten": [],
        }
        response = self.client.post(self.url, data, format="json")
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)


class GroepDetailViewTest(APITestCase):
    def setUp(self):
        self.groep = GroepFactory.create()
        self.gebruiker = GebruikerFactory.create(is_lesgever=True)
        self.url = reverse("groep_detail", kwargs={"id": self.groep.groep_id})
        self.client = APIClient()
        self.client.force_login(self.gebruiker.user)

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

    def test_groep_detail_put_unauthorized(self):
        student = GebruikerFactory.create(is_lesgever=False)
        self.client.force_login(student.user)
        new_data = {
            "groep_id": self.groep.groep_id,
            "project": self.groep.project.project_id,
            "studenten": [],
        }
        response = self.client.put(self.url, new_data, format="json")
        self.assertEqual(response.status_code, status.HTTP_403_FORBIDDEN)

    def test_groep_detail_put_invalid(self):
        new_data = {
            "groep_id": self.groep.groep_id,
            "project": 69,
            "studenten": [],
        }
        response = self.client.put(self.url, new_data, format="json")
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)

    def test_groep_detail_patch(self):
        new_data = {"studenten": []}
        response = self.client.patch(self.url, new_data, format="json")
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.groep.refresh_from_db()
        self.assertEqual(set(self.groep.studenten.all()), set(new_data["studenten"]))

    def test_groep_detail_delete(self):
        response = self.client.delete(self.url)
        self.assertEqual(response.status_code, status.HTTP_204_NO_CONTENT)

    def test_groep_detail_delete_unauthorized(self):
        student = GebruikerFactory.create(is_lesgever=False)
        self.client.force_login(student.user)
        response = self.client.delete(self.url)
        self.assertEqual(response.status_code, status.HTTP_403_FORBIDDEN)

    def test_get_invalid_groep(self):
        response = self.client.get(reverse("groep_detail", kwargs={"id": 10101}))
        self.assertEqual(response.status_code, status.HTTP_404_NOT_FOUND)
