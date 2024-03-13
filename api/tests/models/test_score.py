from django.test import TestCase
from api.tests.factories.score import ScoreFactory
from api.tests.factories.indiening import IndieningFactory


class ScoreModelTest(TestCase):
    def setUp(self):
        self.indiening = IndieningFactory.create()
        self.score = ScoreFactory.create(indiening=self.indiening)

    def test_str_method(self):
        self.assertEqual(str(self.score), str(self.score.score_id))

    def test_score_value(self):
        self.assertTrue(0 <= self.score.score <= 100)

    def test_score_indiening(self):
        self.assertEqual(self.score.indiening, self.indiening)
