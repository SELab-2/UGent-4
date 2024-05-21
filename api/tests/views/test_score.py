from django.test import TestCase
from api.tests.factories.score import ScoreFactory
from api.tests.factories.indiening import IndieningFactory
from api.tests.factories.gebruiker import GebruikerFactory
from rest_framework.test import APIClient
from django.urls import reverse
from rest_framework import status
from unittest.mock import patch


class ScoreListViewTest(TestCase):
    @patch("api.models.indiening.send_indiening_confirmation_mail")
    def setUp(self, mock_send_mail):
        self.client = APIClient()
        self.teacher = GebruikerFactory.create(is_lesgever=True)
        self.student = GebruikerFactory.create(is_lesgever=False)
        self.score1 = ScoreFactory.create()
        self.score2 = ScoreFactory.create()
        self.score2.indiening.groep.studenten.add(self.student)
        self.client.force_login(self.teacher.user)
        self.url = reverse("score_list")

    def test_score_list_get_as_teacher(self):
        response = self.client.get(self.url)
        self.assertEqual(response.status_code, status.HTTP_200_OK)

    def test_score_list_get_as_student(self):
        self.client.force_login(self.student.user)
        response = self.client.get(self.url)
        self.assertEqual(response.status_code, status.HTTP_200_OK)

    def test_score_list_get_indiening(self):
        response = self.client.get(
            self.url, {"indiening": self.score1.indiening.indiening_id}
        )
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(len(response.data), 1)
        self.assertEqual(response.data[0]["score_id"], self.score1.score_id)

    def test_score_list_get_invalid_indiening(self):
        response = self.client.get(self.url, {"indiening": "indiening"})
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)

    @patch("api.models.indiening.send_indiening_confirmation_mail")
    def test_score_list_post(self, mock_send_mail):
        indiening = IndieningFactory.create()
        data = {
            "score_id": self.score1.score_id,
            "score": indiening.groep.project.max_score,
            "indiening": indiening.indiening_id,
        }
        response = self.client.post(self.url, data, format="json")
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)

    @patch("api.models.indiening.send_indiening_confirmation_mail")
    def test_score_list_post_unauthorized(self, mock_send_mail):
        self.client.force_login(self.student.user)
        indiening = IndieningFactory.create()
        data = {
            "score_id": self.score1.score_id,
            "score": indiening.groep.project.max_score,
            "indiening": indiening.indiening_id,
        }
        response = self.client.post(self.url, data, format="json")
        self.assertEqual(response.status_code, status.HTTP_403_FORBIDDEN)

    def test_score_list_post_invalid(self):
        data = {
            "score_id": self.score1.score_id,
            "score": self.score1.score,
            "indiening": "indiening",
        }
        response = self.client.post(self.url, data, format="json")
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)


class ScoreDetailViewTest(TestCase):
    @patch("api.models.indiening.send_indiening_confirmation_mail")
    def setUp(self, mock_send_mail):
        self.client = APIClient()
        self.teacher = GebruikerFactory.create(is_lesgever=True)
        self.student = GebruikerFactory.create(is_lesgever=False)
        self.score = ScoreFactory.create()
        self.score.indiening.groep.studenten.add(self.student)
        self.client.force_login(self.teacher.user)
        self.url = reverse("score_detail", kwargs={"id": self.score.score_id})

    def test_score_detail_get_as_teacher(self):
        response = self.client.get(self.url)
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(response.data["score_id"], self.score.score_id)

    def test_score_detail_get_as_student(self):
        self.client.force_login(self.student.user)
        response = self.client.get(self.url)
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(response.data["score_id"], self.score.score_id)

    def test_score_detail_get_unauthorized(self):
        student = GebruikerFactory.create(is_lesgever=False)
        self.client.force_login(student.user)
        response = self.client.get(self.url)
        self.assertEqual(response.status_code, status.HTTP_403_FORBIDDEN)

    def test_score_detail_get_invalid(self):
        response = self.client.get(reverse("score_detail", kwargs={"id": 69}))
        self.assertEqual(response.status_code, status.HTTP_404_NOT_FOUND)

    def test_score_detail_put(self):
        new_data = {"score": 10, "indiening": self.score.indiening.indiening_id}
        response = self.client.put(self.url, new_data, format="json")
        self.assertEqual(response.status_code, 200)
        self.score.refresh_from_db()
        self.assertEqual(self.score.score, new_data["score"])

    def test_score_detail_put_invalid(self):
        new_data = {"score": 10, "indiening": "indiening"}
        response = self.client.put(self.url, new_data, format="json")
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)

    def test_score_detail_put_unauthorized(self):
        student = GebruikerFactory.create(is_lesgever=False)
        self.client.force_login(student.user)
        new_data = {"score": 10, "indiening": self.score.indiening.indiening_id}
        response = self.client.put(self.url, new_data, format="json")
        self.assertEqual(response.status_code, status.HTTP_403_FORBIDDEN)

    def test_score_detail_patch(self):
        new_data = {"score": 10}
        response = self.client.patch(self.url, new_data, format="json")
        self.assertEqual(response.status_code, 200)
        self.score.refresh_from_db()
        self.assertEqual(self.score.score, new_data["score"])

    def test_score_detail_delete(self):
        response = self.client.delete(self.url)
        self.assertEqual(response.status_code, status.HTTP_204_NO_CONTENT)

    def test_score_detail_delete_unauthorized(self):
        student = GebruikerFactory.create(is_lesgever=False)
        self.client.force_login(student.user)
        response = self.client.delete(self.url)
        self.assertEqual(response.status_code, status.HTTP_403_FORBIDDEN)
