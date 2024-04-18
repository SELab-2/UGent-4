from django.test import TestCase
from django.core.files.uploadedfile import SimpleUploadedFile
from api.tests.factories.indiening import IndieningFactory, IndieningBestandFactory
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

    def test_indiening_bestanden(self):
        self.assertEqual(self.indiening.indiening_bestanden.count(), 1)

    def test_upload_to(self):
        filename = "test_indiening.txt"
        expected_path = (
            f"data/indieningen/indiening_{self.indiening.indiening_id}/{filename}"
        )
        self.assertEqual(upload_to(self.indiening, filename), expected_path)


class IndieningBestandModelTest(TestCase):
    def setUp(self):
        self.indiening_bestand = IndieningBestandFactory.create(
            bestand=SimpleUploadedFile("file.txt", b"file_content")
        )

    def test_str_method(self):
        self.assertEqual(
            str(self.indiening_bestand), str(self.indiening_bestand.bestand.name)
        )

    def test_indiening(self):
        self.assertIsNotNone(self.indiening_bestand.indiening)

    def test_bestand(self):
        self.assertIsNotNone(self.indiening_bestand.bestand)
