from django.test import TestCase
from api.tests.factories.indiening import IndieningFactory
from api.models.indiening import upload_to


class IndieningModelTest(TestCase):
    def setUp(self):
        self.indiening = IndieningFactory.create()

    def test_str_method(self):
        self.assertEqual(str(self.indiening), str(self.indiening.indiening_id))

    def test_groep(self):
        self.assertIsNotNone(self.indiening.groep)

    def test_tijdstip(self):
        self.assertIsNotNone(self.indiening.tijdstip)

    def test_status(self):
        self.assertIsNotNone(self.indiening.status)

    def test_upload_to(self):
        filename = "test_indiening.txt"
        expected_path = (
            f"data/indieningen/indiening_{self.indiening.indiening_id}/{filename}"
        )
        self.assertEqual(upload_to(self.indiening, filename), expected_path)
    
    def test_artefacten(self):
        self.assertIsNotNone(self.indiening.artefacten)
    
    def test_result(self):
        self.assertIsNotNone(self.indiening.result)
    
    def test_bestand(self):
        self.assertIsNotNone(self.indiening.bestand)

