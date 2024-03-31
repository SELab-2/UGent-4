from django.test import TestCase
from api.tests.factories.project import ProjectFactory
from api.models.project import upload_to


class ProjectModelTest(TestCase):
    def setUp(self):
        self.project = ProjectFactory.create()

    def test_str_method(self):
        self.assertEqual(str(self.project), self.project.titel)

    def test_project_vak(self):
        self.assertIsNotNone(self.project.vak)

    def test_project_max_score(self):
        self.assertTrue(10 <= self.project.max_score <= 100)

    def test_project_zichtbaar(self):
        self.assertIsNotNone(self.project.zichtbaar)

    def test_project_gearchiveerd(self):
        self.assertIsNotNone(self.project.gearchiveerd)

    def test_project_deadline(self):
        self.assertIsNotNone(self.project.deadline)

    def test_project_extra_deadline(self):
        self.assertIsNotNone(self.project.extra_deadline)

    def test_project_opgave_bestand(self):
        self.assertEqual(self.project.opgave_bestand.read(), b"file content")

    def test_upload_to(self):
        filename = "test_opgave.txt"
        expected_path = f"data/opgaves/vak_{self.project.vak.vak_id}/{filename}"
        self.assertEqual(upload_to(self.project, filename), expected_path)
