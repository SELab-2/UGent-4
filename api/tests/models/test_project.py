from django.test import TestCase
from api.tests.factories.project import ProjectFactory


class ProjectModelTest(TestCase):
    def setUp(self):
        self.project = ProjectFactory.create()

    def test_str_method(self):
        self.assertEqual(str(self.project), self.project.titel)

    def test_project_vak(self):
        self.assertIsNotNone(self.project.vak)

    def test_project_max_score(self):
        self.assertTrue(10 <= self.project.max_score <= 100)
