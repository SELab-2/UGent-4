from django.test import TestCase
from api.tests.factories.score import ScoreFactory
from api.tests.factories.groep import GroepFactory
from api.tests.factories.indiening import IndieningFactory


class ScoreModelTest(TestCase):
    def setUp(self):
        self.indiening = IndieningFactory.create()
        self.groep = GroepFactory.create()
        self.score = ScoreFactory.create(indiening=self.indiening, groep=self.groep)

    def test_score_field(self):
        self.assertIsInstance(self.score.score, int)

    def test_indiening_field(self):
        self.assertEqual(self.score.indiening, self.indiening)

    def test_groep_field(self):
        self.assertEqual(self.score.groep, self.groep)

    def test_str_method(self):
        self.assertEqual(str(self.score), str(self.score.score))
