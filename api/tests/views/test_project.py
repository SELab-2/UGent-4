from django.urls import reverse
from rest_framework import status
from rest_framework.test import APITestCase
from api.tests.factories.project import ProjectFactory
from api.tests.factories.vak import VakFactory

class ProjectViewTest(APITestCase):

    def setUp(self):
        self.project = ProjectFactory.create()
        self.vak = VakFactory.create()
        self.list_url = reverse('project_list')
        self.detail_url = reverse('project_detail', kwargs={'id': self.project.project_id})

    def test_get_project_list(self):
        response = self.client.get(self.list_url)
        self.assertEqual(response.status_code, status.HTTP_200_OK)

    def test_get_project_detail(self):
        response = self.client.get(self.detail_url)
        self.assertEqual(response.status_code, status.HTTP_200_OK)

    def test_get_invalid_project_detail(self):
        url = reverse('project_detail', kwargs={'id': '9999999'})
        response = self.client.get(url)
        self.assertEqual(response.status_code, status.HTTP_404_NOT_FOUND)

    def test_create_project(self):
        data = {
            "titel": "New Project",
            "description": "This is a new project.",
            "opgavebestanden": "data/opgaves/opgave.pdf",
            "vak": self.vak.vak_id,
            "deadline": "2022-12-31T23:59:59Z"
        }
        response = self.client.post(self.list_url, data)
        # TODO
        # self.assertEqual(response.status_code, status.HTTP_201_CREATED)

    def test_create_invalid_project(self):
        data = {
            "titel": "", 
            "description": "", 
            "opgavebestanden": "", 
            "vak": "", 
            "deadline": "" 
        }
        response = self.client.post(self.list_url, data)
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)

    def test_update_project(self):
        data = {
            "titel": "Updated Project",
            "description": "This project has been updated.",
            "opgavebestanden": "data/opgaves/opgave.pdf", 
            "vak": self.project.vak.vak_id,
            "deadline": "2023-12-31T23:59:59Z"
        }
        response = self.client.put(self.detail_url, data)
        # TODO
        # self.assertEqual(response.status_code, status.HTTP_200_OK)

    def test_update_invalid_project(self):
        data = {
            "titel": "", 
            "description": "", 
            "opgavebestanden": "", 
            "vak": "", 
            "deadline": "" 
        }
        response = self.client.put(self.detail_url, data)
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)


    def test_delete_project(self):
        response = self.client.delete(self.detail_url)
        self.assertEqual(response.status_code, status.HTTP_204_NO_CONTENT)