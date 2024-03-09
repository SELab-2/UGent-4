from rest_framework.test import APIClient, APITestCase
from api.tests.factories.gebruiker import GebruikerFactory, UserFactory
from django.urls import reverse


class GebruikerListViewTest(APITestCase):
    def setUp(self):
        self.client = APIClient()
        self.gebruiker = GebruikerFactory.create()

    def test_get_gebruiker_list(self):
        response = self.client.get('/api/gebruikers/')
        self.assertEqual(response.status_code, 200)

    def test_post_gebruiker_list(self):
        data = {'user': UserFactory.create().id, 'is_lesgever': True}
        response = self.client.post('/api/gebruikers/', data)
        self.assertEqual(response.status_code, 201)


class GebruikerDetailViewTest(APITestCase):
    def setUp(self):
        self.client = APIClient()
        self.gebruiker = GebruikerFactory.create()
        self.url = reverse('gebruiker_detail', kwargs={'id': self.gebruiker.user.id})

    def test_get_gebruiker_detail(self):
        response = self.client.get(self.url)
        self.assertEqual(response.status_code, 200)
        self.assertEqual(response.data['user'], self.gebruiker.user.id)

    def test_put_gebruiker_detail(self):
        data = {'user': self.gebruiker.user.id, 'is_lesgever': True, 'subjects': []}
        response = self.client.put(self.url, data)
        self.assertEqual(response.status_code, 200)
        self.assertEqual(response.data['is_lesgever'], True)
