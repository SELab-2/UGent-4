from django.test import TestCase
from api.tests.factories.restrictie import RestrictieFactory
from api.models.restrictie import upload_to


class RestrictieModelTest(TestCase):
    def setUp(self):
        self.restrictie = RestrictieFactory.create()

    def test_project(self):
        self.assertIsNotNone(self.restrictie.project)

    def test_script(self):
        self.assertIsNotNone(self.restrictie.script)

    def test_moet_slagen(self):
        self.assertIsNotNone(self.restrictie.moet_slagen)

    def test_str_method(self):
        expected_str = (
            self.restrictie.project.titel
            + ", restrictie: "
            + str(self.restrictie.script)
        )
        self.assertEqual(str(self.restrictie), expected_str)

    def test_upload_to(self):
        project = self.restrictie.project
        filename = "test_script.txt"
        expected_path = f"data/restricties/project_{project.project_id}/{filename}"
        self.assertEqual(upload_to(self.restrictie, filename), expected_path)
