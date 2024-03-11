from django.test import TestCase
from api.tests.factories.project import ProjectFactory


class ProjectModelTest(TestCase):
    def setUp(self):
        self.project = ProjectFactory.create()

    def test_str_method(self):
        self.assertEqual(str(self.project), self.project.titel)

    def test_titel_label(self):
        field_label = self.project._meta.get_field("titel").verbose_name
        self.assertEqual(field_label, "titel")

    def test_description_label(self):
        field_label = self.project._meta.get_field("description").verbose_name
        self.assertEqual(field_label, "description")

    def test_opgavebestanden_label(self):
        field_label = self.project._meta.get_field("opgavebestanden").verbose_name
        self.assertEqual(field_label, "opgavebestanden")

    def test_vak_label(self):
        field_label = self.project._meta.get_field("vak").verbose_name
        self.assertEqual(field_label, "vak")

    def test_deadline_label(self):
        field_label = self.project._meta.get_field("deadline").verbose_name
        self.assertEqual(field_label, "deadline")
