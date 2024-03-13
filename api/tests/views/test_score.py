# test_score.py
from django.test import TestCase, RequestFactory
from api.views.score import score_list, score_detail
from api.tests.factories.score import ScoreFactory
from api.tests.factories.indiening import IndieningFactory
from api.tests.factories.gebruiker import GebruikerFactory
from rest_framework.test import force_authenticate, APIClient
from django.urls import reverse
from rest_framework import status

class ScoreListViewTest(TestCase):
    def setUp(self):
        self.client = APIClient()
        self.gebruiker = GebruikerFactory.create(is_lesgever=True)
        self.score = ScoreFactory.create()
        self.score.score = self.score.indiening.groep.project.max_score
        self.score.save()
        self.client.force_authenticate(user=self.gebruiker.user)
        self.url = reverse("score_list")

    def test_score_list_get(self):
        response = self.client.get(self.url)
        self.assertEqual(response.status_code, status.HTTP_200_OK)

    def test_score_list_post(self):
        indiening = IndieningFactory.create()
        data = {"score_id": self.score.score_id, "score": indiening.groep.project.max_score, "indiening": indiening.indiening_id}
        response = self.client.post(self.url, data, format='json')
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)

    
class ScoreDetailViewTest(TestCase):
    def setUp(self):
        self.client = APIClient()
        self.gebruiker = GebruikerFactory.create()
        self.gebruiker.user.is_superuser = True
        self.gebruiker.user.save()
        self.score = ScoreFactory.create()
        self.client.force_authenticate(user=self.gebruiker.user)
        self.url = reverse("score_detail", kwargs={"id": self.score.score_id})
    
    def test_score_detail_get(self):
        response = self.client.get(self.url)
        self.assertEqual(response.status_code, status.HTTP_200_OK)
    
    def test_score_detail_put(self):
        new_data = {"score": 10, "indiening": self.score.indiening.indiening_id}
        response = self.client.put(self.url, new_data, format='json')
        self.assertEqual(response.status_code, 200)
        self.score.refresh_from_db()
        self.assertEqual(self.score.score, new_data["score"])  # Add other assertions

    def test_score_detail_delete(self):
        response = self.client.delete(self.url)
        self.assertEqual(response.status_code, 204)