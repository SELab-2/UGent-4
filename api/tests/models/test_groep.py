from django.test import TestCase
from api.tests.factories.groep import GroepFactory
from api.tests.factories.gebruiker import GebruikerFactory
from api.tests.factories.project import ProjectFactory
from api.tests.factories.vak import VakFactory
from api.models.groep import Groep


class GroepModelTest(TestCase):
    def setUp(self):
        self.gebruiker = GebruikerFactory.create()
        self.vak = VakFactory.create()
        self.project = ProjectFactory.create(vak=self.vak)
        self.groep = GroepFactory.create(project=self.project)


    def test_groep_creation(self):
        self.assertIsInstance(self.groep, Groep)
        self.assertEqual(self.groep.__str__(), f"Group {self.groep.group_id}")

    def test_groep_students(self):
        self.groep.students.add(self.gebruiker)
        self.assertEqual(self.groep.students.count(), 2)
        self.assertEqual(self.groep.students.first(), self.gebruiker)

    def test_groep_project(self):
        self.assertEqual(self.groep.project, self.project)