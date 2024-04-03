from django.test import TestCase, Client
from django.urls import reverse
from rest_framework import status
from api.tests.factories.gebruiker import GebruikerFactory
from api.utils import API_URLS


class ViewTestCase(TestCase):
    def setUp(self):
        self.client = Client()
        self.gebruiker = GebruikerFactory.create()

    def test_home(self):
        self.client.force_login(self.gebruiker.user)
        response = self.client.get(reverse("home"))
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(response.data, API_URLS)
