from django.test import TestCase
from api.tests.factories.template import TemplateFactory
from api.models.template import Template
from api.models.template import upload_to


class TemplateModelTest(TestCase):
    def setUp(self):
        self.template = TemplateFactory.create()

    def test_template_creation(self):
        self.assertIsInstance(self.template, Template)
        self.assertEqual(Template.objects.count(), 1)

    def test_template_str(self):
        self.assertEqual(str(self.template), self.template.bestand.name)

    def test_upload_to(self):
        filename = "test_template.txt"
        expected_path = f"data/templates/gebruiker_{self.template.user.id}/{filename}"
        self.assertEqual(upload_to(self.template, filename), expected_path)
