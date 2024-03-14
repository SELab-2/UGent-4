# test_indiening.py
from django.test import TestCase
from django.core.files.uploadedfile import SimpleUploadedFile
from api.tests.factories.indiening import IndieningFactory, IndieningBestandFactory


class IndieningModelTest(TestCase):
    def setUp(self):
        self.indiening = IndieningFactory.create()

    def test_str_method(self):
        self.assertEqual(str(self.indiening), str(self.indiening.indiening_id))

    def test_groep(self):
        self.assertIsNotNone(self.indiening.groep)

    def test_tijdstip(self):
        self.assertIsNotNone(self.indiening.tijdstip)

    def test_indiening_bestand(self):
        self.assertEqual(self.indiening.indieningbestand_set.count(), 0)

    def test_indiening_bestand_add(self):
        IndieningBestandFactory.create(indiening=self.indiening)
        self.assertEqual(self.indiening.indieningbestand_set.count(), 1)


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
