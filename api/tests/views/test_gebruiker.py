from rest_framework.test import APIClient, APITestCase
from api.tests.factories.gebruiker import GebruikerFactory
from django.urls import reverse
from rest_framework import status


class GebruikerListViewTest(APITestCase):
    def setUp(self):
        self.student = GebruikerFactory.create(is_lesgever=False)
        self.student.user.is_superuser = False
        self.teacher = GebruikerFactory.create(is_lesgever=True)
        self.url = reverse("gebruiker_list")
        self.client = APIClient()

    def test_gebruiker_list_get_as_student(self):
        self.client.force_login(self.student.user)
        response = self.client.get(self.url)
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(len(response.data), 1)

    def test_gebruiker_list_get_lesgevers(self):
        self.client.force_login(self.teacher.user)
        response = self.client.get(self.url, {"is_lesgever": "true"}, format="json")
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(len(response.data), 1)

    def test_gebruiker_list_get(self):
        self.client.force_login(self.teacher.user)
        response = self.client.get(self.url)
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(len(response.data), 2)
    
    def test_gebruiker_list_get_email(self):
        self.client.force_login(self.teacher.user)
        response = self.client.get(self.url, {"email": self.student.user.email}, format="json")
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(len(response.data), 1)
    
    def test_gebruiker_list_get_email_non_existing(self):
        self.client.force_login(self.teacher.user)
        response = self.client.get(self.url, {"email": "fake@email.com"}, format="json")
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(len(response.data), 0)


class GebruikerDetailViewTest(APITestCase):
    def setUp(self):
        self.gebruiker = GebruikerFactory.create()
        self.gebruiker.user.is_superuser = True
        self.gebruiker.user.save()
        self.client = APIClient()
        self.client.force_login(self.gebruiker.user)
        self.url = reverse("gebruiker_detail", kwargs={"id": self.gebruiker.user.id})

    def test_gebruiker_detail_get(self):
        response = self.client.get(self.url)
        self.assertEqual(response.status_code, status.HTTP_200_OK)

    def test_gebruiker_detail_put(self):
        new_data = {
            "user": self.gebruiker.user.id,
            "is_lesgever": not self.gebruiker.is_lesgever,
            "gepinde_vakken": self.gebruiker.gepinde_vakken.all(),
        }
        response = self.client.put(self.url, new_data, format="json")
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.gebruiker.refresh_from_db()
        self.assertEqual(self.gebruiker.is_lesgever, new_data["is_lesgever"])

    def test_gebruiker_detail_get_non_existing_user(self):
        response = self.client.get(reverse("gebruiker_detail", kwargs={"id": 69}))
        self.assertEqual(response.status_code, status.HTTP_404_NOT_FOUND)

    def test_gebruiker_detail_get_unauthorized(self):
        student = GebruikerFactory.create(is_lesgever=False)
        self.client.force_login(student.user)
        response = self.client.get(self.url)
        self.assertEqual(response.status_code, status.HTTP_403_FORBIDDEN)

    def test_gebruiker_detail_put_unauthorized(self):
        student = GebruikerFactory.create(is_lesgever=False)
        self.client.force_login(student.user)
        new_data = {
            "user": self.gebruiker.user.id,
            "is_lesgever": not self.gebruiker.is_lesgever,
        }
        response = self.client.put(self.url, new_data, format="json")
        self.assertEqual(response.status_code, status.HTTP_403_FORBIDDEN)

    def test_gebruiker_detail_put_bad_request(self):
        new_data = {
            "user": 69,
            "is_lesgever": True,
        }
        response = self.client.put(self.url, new_data, format="json")
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)

    def test_gebruiker_detail_patch(self):
        new_data = {
            "is_lesgever": not self.gebruiker.is_lesgever,
        }
        response = self.client.patch(self.url, new_data, format="json")
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.gebruiker.refresh_from_db()
        self.assertEqual(self.gebruiker.is_lesgever, new_data["is_lesgever"])


class GebruikerDetailMeViewTest(APITestCase):
    def setUp(self):
        self.student = GebruikerFactory.create(is_lesgever=False)
        self.student.user.is_superuser = False
        self.url = reverse("gebruiker_detail_me")
        self.client = APIClient()
        self.client.force_login(self.student.user)

    def test_gebruiker_detail_me_get(self):
        response = self.client.get(self.url)
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(response.data["user"], self.student.user.id)
