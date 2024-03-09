from rest_framework.test import APIClient, APITestCase
from api.tests.factories.gebruiker import GebruikerFactory, UserFactory


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