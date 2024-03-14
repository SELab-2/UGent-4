# test_indiening.py
from django.test import TestCase
from api.tests.factories.indiening import IndieningFactory, IndieningBestandFactory
from api.tests.factories.groep import GroepFactory
from api.tests.factories.gebruiker import GebruikerFactory
from rest_framework.test import force_authenticate, APIClient
from django.urls import reverse
from rest_framework import status


class IndieningListViewTest(TestCase):
    def setUp(self):
        self.client = APIClient()
        self.gebruiker = GebruikerFactory.create()
        self.gebruiker.user.is_superuser = True
        self.gebruiker.user.save()
        self.client.force_authenticate(user=self.gebruiker.user)
        self.url = reverse("indiening_list")

    def test_indiening_list_get(self):
        response = self.client.get(self.url)
        self.assertEqual(response.status_code, status.HTTP_200_OK)

    
    def test_indiening_list_post(self):
        indiening = IndieningFactory.create()
        data = {"indiening_id": indiening.indiening_id,"groep": indiening.groep_id, "tijdstip": indiening.tijdstip}
        response = self.client.post(self.url, data, format='json')
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)

    
class IndieningDetailViewTest(TestCase):
    def setUp(self):
        self.client = APIClient()
        self.gebruiker = GebruikerFactory.create()
        self.gebruiker.user.is_superuser = True
        self.gebruiker.user.save()
        self.indiening = IndieningFactory.create()
        self.client.force_authenticate(user=self.gebruiker.user)
        self.url = reverse("indiening_detail", kwargs={"id": self.indiening.indiening_id})
    

    def test_indiening_detail_get(self):
        response = self.client.get(self.url)
        self.assertEqual(response.status_code, status.HTTP_200_OK)
    

    def test_indiening_detail_delete(self):
        response = self.client.delete(self.url)
        self.assertEqual(response.status_code, status.HTTP_204_NO_CONTENT)

class IndieningBestandViewTest(TestCase):
    def setUp(self):
        self.client = APIClient()
        self.gebruiker = GebruikerFactory.create()
        self.gebruiker.user.is_superuser = True
        self.gebruiker.user.save()
        self.indiening_bestand = IndieningBestandFactory.create()
        self.client.force_authenticate(user=self.gebruiker.user)
        self.url = reverse("indiening_bestand_list")

    def test_indiening_bestand_list_get(self):
        response = self.client.get(self.url)
        self.assertEqual(response.status_code, status.HTTP_200_OK)

    def test_indiening_bestand_detail_get(self):
        response = self.client.get(self.url)
        self.assertEqual(response.status_code, status.HTTP_200_OK)