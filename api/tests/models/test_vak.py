from django.test import TestCase
from api.tests.factories.vak import VakFactory


class VakModelTest(TestCase):
    def setUp(self):
        self.vak = VakFactory.create()

    def test_str_method(self):
        self.assertEqual(str(self.vak), self.vak.naam)

    def test_vak_studenten(self):
        self.assertEqual(self.vak.studenten.count(), 1)

    def test_vak_lesgevers(self):
        self.assertEqual(self.vak.lesgevers.count(), 1)
