from django.test import TestCase
from rest_framework.exceptions import ValidationError
from api.tests.factories.template import TemplateFactory
from api.serializers.template import TemplateSerializer


class TemplateSerializerTest(TestCase):
    def setUp(self):
        self.template = TemplateFactory.create()
        self.serializer = TemplateSerializer(instance=self.template)

    def test_contains_expected_fields(self):
        data = self.serializer.data
        self.assertCountEqual(data.keys(), ["template_id", "user", "bestand"])

    def test_template_id_field_content(self):
        data = self.serializer.data
        self.assertEqual(data["template_id"], self.template.template_id)

    def test_user_field_content(self):
        data = self.serializer.data
        self.assertEqual(data["user"], self.template.user.id)

    def test_bestand_field_content(self):
        data = self.serializer.data
        self.assertEqual(data["bestand"], self.template.bestand.url)

    def test_validation(self):
        invalid_data = {
            "user": "",
            "bestand": "",
        }
        serializer = TemplateSerializer(data=invalid_data)
        with self.assertRaises(ValidationError):
            serializer.is_valid(raise_exception=True)
