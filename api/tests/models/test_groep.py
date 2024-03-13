from django.test import TestCase
from api.tests.factories.groep import GroepFactory
from api.tests.factories.gebruiker import GebruikerFactory
from api.tests.factories.project import ProjectFactory
from api.tests.factories.vak import VakFactory


class GroepModelTest(TestCase):
    def setUp(self):
        self.gebruiker = GebruikerFactory.create()
        self.vak = VakFactory.create()
        self.project = ProjectFactory.create(vak=self.vak)
        self.groep = GroepFactory.create(project=self.project)

    def test_str_method(self):
        self.assertEqual(str(self.groep), f"Group {self.groep.groep_id}")

    def test_groep_studenten(self):
        self.groep.studenten.add(self.gebruiker)
        self.assertEqual(self.groep.studenten.count(), 2)
        self.assertEqual(self.groep.studenten.first(), self.gebruiker)

    def test_groep_project(self):
        self.assertEqual(self.groep.project, self.project)
