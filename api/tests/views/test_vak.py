from django.urls import reverse
from rest_framework import status
from rest_framework.test import APITestCase
from api.tests.factories.vak import VakFactory
from api.tests.factories.gebruiker import GebruikerFactory
from rest_framework.test import APIClient


class VakListViewTest(APITestCase):
    def setUp(self):
        self.client = APIClient()
        self.teacher = GebruikerFactory.create(is_lesgever=True)
        self.studenten = GebruikerFactory.create_batch(3, is_lesgever=False)
        self.lesgevers = GebruikerFactory.create_batch(2, is_lesgever=True)
        self.vak1 = VakFactory.create()
        self.vak1.studenten.add(self.studenten[0])
        self.vak1.lesgevers.add(self.lesgevers[0])
        self.vak2 = VakFactory.create()
        self.client.force_login(self.teacher.user)
        self.url = reverse("vak_list")

    def test_vak_list_get_as_teacher(self):
        response = self.client.get(self.url)
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(len(response.data), 2)

    def test_vak_list_get_as_student(self):
        self.client.force_login(self.studenten[0].user)
        response = self.client.get(self.url)
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(len(response.data), 2)
    
    def test_vak_list_get_in_as_teacher(self):
        self.client.force_login(self.lesgevers[0].user)
        response = self.client.get(self.url, {"in": True})
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(len(response.data), 1)
    
    def test_vak_list_get_in_as_student(self):
        self.client.force_login(self.studenten[0].user)
        response = self.client.get(self.url, {"in": True})
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(len(response.data), 1)
    
    def test_vak_list_archived(self):
        self.client.force_login(self.lesgevers[0].user)
        self.vak1.gearchiveerd = True
        self.vak1.save()
        response = self.client.get(self.url, {"gearchiveerd": True})
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(len(response.data), 1)

    def test_vak_list_post(self):
        data = {
            "naam": "test_name",
            "studenten": [student.user.id for student in self.studenten],
            "lesgevers": [lesgever.user.id for lesgever in self.lesgevers],
        }
        response = self.client.post(self.url, data)
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)

    def test_vak_list_post_unauthorized(self):
        self.client.force_login(self.studenten[0].user)
        data = {
            "naam": "test_name",
            "studenten": [student.user.id for student in self.studenten],
            "lesgevers": [lesgever.user.id for lesgever in self.lesgevers],
        }
        response = self.client.post(self.url, data)
        self.assertEqual(response.status_code, status.HTTP_403_FORBIDDEN)

    def test_vak_list_post_invalid(self):
        data = {
            "studenten": [student.user.id for student in self.studenten],
            "lesgevers": [lesgever.user.id for lesgever in self.lesgevers],
        }
        response = self.client.post(self.url, data)
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)


class VakDetailViewTest(APITestCase):
    def setUp(self):
        self.vak = VakFactory.create()
        self.client = APIClient()
        self.gebruiker = GebruikerFactory.create(is_lesgever=True)
        self.studenten = GebruikerFactory.create_batch(3, is_lesgever=False)
        self.lesgevers = GebruikerFactory.create_batch(2, is_lesgever=True)
        self.vak.studenten.add(self.studenten[0])
        self.client.force_login(self.gebruiker.user)
        self.url = reverse("vak_detail", args=[self.vak.vak_id])

    def test_vak_detail_get_as_teacher(self):
        response = self.client.get(self.url)
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(response.data["vak_id"], self.vak.vak_id)

    def test_vak_detail_get_as_student(self):
        self.client.force_login(self.studenten[0].user)
        response = self.client.get(self.url)
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(response.data["vak_id"], self.vak.vak_id)

    def test_vak_detail_get_invalid(self):
        response = self.client.get(reverse("vak_detail", args=[69]))
        self.assertEqual(response.status_code, status.HTTP_404_NOT_FOUND)

    def test_vak_detail_put(self):
        data = {
            "vak_id": self.vak.vak_id,
            "naam": "nieuwe_vak_naam",
            "studenten": [student.user.id for student in self.studenten],
            "lesgevers": [teacher.user.id for teacher in self.lesgevers],
        }
        response = self.client.put(self.url, data)
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(response.data["naam"], data["naam"])

    def test_vak_detail_put_invalid(self):
        data = {
            "vak_id": "",
            "naam": "",
            "studenten": "",
            "lesgevers": "",
        }
        response = self.client.put(self.url, data)
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)

    def test_vak_detail_patch(self):
        data = {
            "naam": "nieuwe_vak_naam",
        }
        response = self.client.patch(self.url, data)
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(response.data["naam"], data["naam"])

    def test_vak_detail_delete(self):
        response = self.client.delete(self.url)
        self.assertEqual(response.status_code, status.HTTP_204_NO_CONTENT)

    def test_vak_detail_delete_unauthorized(self):
        self.client.force_login(self.studenten[1].user)
        response = self.client.delete(self.url)
        self.assertEqual(response.status_code, status.HTTP_403_FORBIDDEN)


class VakDetailAcceptInviteViewTest(APITestCase):
    def setUp(self):
        self.client = APIClient()
        self.vak = VakFactory.create()
        self.student = GebruikerFactory.create(is_lesgever=False)
        self.teacher = GebruikerFactory.create(is_lesgever=True)
        self.client.force_login(self.student.user)
        self.url = reverse("vak_detail_accept_invite", args=[self.vak.vak_id])
        self.vak_url = reverse("vak_detail", args=[self.vak.vak_id])
    
    def test_vak_detail_accept_invite_as_student(self):
        response = self.client.get(self.url)
        self.assertEqual(response.status_code, status.HTTP_302_FOUND)
        response = self.client.get(self.vak_url)
        self.assertIn(self.student.user.id, response.data["studenten"])

    def test_vak_detail_accept_invite_as_teacher(self):
        self.client.force_login(self.teacher.user)
        response = self.client.get(self.url)
        self.assertEqual(response.status_code, status.HTTP_302_FOUND)
        response = self.client.get(self.vak_url)
        self.assertIn(self.teacher.user.id, response.data["lesgevers"])
    
    def test_vak_detail_accept_invite_invalid(self):
        response = self.client.get(reverse("vak_detail_accept_invite", args=[69]))
        self.assertEqual(response.status_code, status.HTTP_404_NOT_FOUND)
    
