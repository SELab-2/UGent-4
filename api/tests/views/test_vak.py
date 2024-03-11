from django.urls import reverse
from rest_framework import status
from rest_framework.test import APITestCase
from api.tests.factories.vak import VakFactory
from api.tests.factories.gebruiker import GebruikerFactory
# from api.models.vak import Vak


class VakViewsTest(APITestCase):

    def setUp(self):
        self.students = GebruikerFactory.create_batch(3, is_lesgever=False)
        self.teachers = GebruikerFactory.create_batch(2, is_lesgever=True)
        self.vak = VakFactory.create()
        self.vak.students.set(self.students)
        self.vak.teachers.set(self.teachers)

    def test_vak_list_get(self):
        response = self.client.get(reverse("vak_list"))
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(len(response.data), 1)

    """" TODO: projecten bijhouden bij een vak ipv vakken bijhouden bij een project
    def test_vak_list_post(self):
        data = {
            'vak_id': 'test_vak_id',
            'name': 'test_name',
            'students': [student.pk for student in self.students],
            'teachers': [teacher.pk for teacher in self.teachers],
        }
        response = self.client.post(reverse('vak_list'), data)
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        self.assertEqual(Vak.objects.count(), 2)
    """

    def test_vak_detail_get(self):
        response = self.client.get(reverse("vak_detail", args=[self.vak.pk]))
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(response.data["vak_id"], self.vak.vak_id)

    """" TODO: projecten bijhouden bij een vak ipv vakken bijhouden bij een project
    def test_vak_detail_put(self):
        data = {
            'vak_id': 'updated_vak_id',
            'name': 'updated_name',
            'students': [student.pk for student in self.students],
            'teachers': [teacher.pk for teacher in self.teachers],
        }
        response = self.client.put(reverse('vak_detail', args=[self.vak.pk]), data)
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(response.data['vak_id'], 'updated_vak_id')
    """

    def test_vak_detail_delete(self):
        response = self.client.delete(reverse("vak_detail", args=[self.vak.pk]))
        self.assertEqual(response.status_code, status.HTTP_204_NO_CONTENT)
