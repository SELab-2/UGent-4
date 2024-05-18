from django.urls import reverse
from rest_framework.test import APIClient, APITestCase
from api.tests.factories.template import TemplateFactory
from api.models.template import Template
from api.tests.factories.gebruiker import GebruikerFactory
from django.core.files.uploadedfile import SimpleUploadedFile

class TemplateListViewTest(APITestCase):
    def setUp(self):
        self.client = APIClient()
        self.template = TemplateFactory.create()
        self.teacher = GebruikerFactory.create(is_lesgever=True)
        self.student = GebruikerFactory.create(is_lesgever=False)
        self.client.force_login(self.teacher.user)
        self.template_list_url = reverse('template_list')

    def test_template_list_get(self):
        response = self.client.get(self.template_list_url)
        self.assertEqual(response.status_code, 200)
        self.assertEqual(len(response.data), Template.objects.count())

    def test_template_list_post(self):
        data = {
            'user': self.template.user.id,
        }
        file = SimpleUploadedFile("template.txt", b"file_content")
        data["bestand"] = file
        response = self.client.post(self.template_list_url, data)
        self.assertEqual(response.status_code, 201)
        self.assertEqual(Template.objects.count(), 2)


class TemplateDetailViewTest(APITestCase):
    def setUp(self):
        self.client = APIClient()
        self.template = TemplateFactory.create()
        self.teacher = GebruikerFactory.create(is_lesgever=True)
        self.student = GebruikerFactory.create(is_lesgever=False)
        self.client.force_login(self.teacher.user)
        self.template_detail_url = reverse('template_detail', kwargs={'id': self.template.template_id})
    
    def test_template_detail_get(self):
        response = self.client.get(self.template_detail_url)
        self.assertEqual(response.status_code, 200)
        self.assertEqual(response.data['template_id'], self.template.template_id)

    def test_template_detail_put(self):
        data = {
            'user': self.template.user.id,
        }
        file = SimpleUploadedFile("template.txt", b"file_content")
        data["bestand"] = file
        response = self.client.put(self.template_detail_url, data)
        self.assertEqual(response.status_code, 200)
        self.assertEqual(response.data['template_id'], self.template.template_id)

    def test_template_detail_delete(self):
        response = self.client.delete(self.template_detail_url)
        self.assertEqual(response.status_code, 204)
        self.assertEqual(Template.objects.count(), 0)