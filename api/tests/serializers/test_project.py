from django.test import TestCase
from rest_framework.test import APITestCase
from rest_framework.exceptions import ValidationError
from api.serializers.project import ProjectSerializer
from api.tests.factories.project import ProjectFactory
from dateutil.parser import parse

class ProjectSerializerTest(APITestCase):

    def setUp(self):
        self.project = ProjectFactory.create()
        self.serializer = ProjectSerializer(instance=self.project)

    def test_contains_expected_fields(self):
        data = self.serializer.data
        self.assertCountEqual(data.keys(), ["project_id", "titel", "description", "opgavebestanden", "vak", "deadline"])

    def test_titel_field_content(self):
        data = self.serializer.data
        self.assertEqual(data["titel"], self.project.titel)

    def test_description_field_content(self):
        data = self.serializer.data
        self.assertEqual(data["description"], self.project.description)

    def test_opgavebestanden_field_content(self):
        data = self.serializer.data
        self.assertEqual(data["opgavebestanden"].lstrip('/'), str(self.project.opgavebestanden))

    def test_vak_field_content(self):
        data = self.serializer.data
        self.assertEqual(data["vak"], self.project.vak.pk)  # replace 'pk' with the correct primary key field of the Vak model

    def test_deadline_field_content(self):
        data = self.serializer.data
        self.assertEqual(parse(data["deadline"]), self.project.deadline)

    def test_validation_for_blank_items(self):
        serializer = ProjectSerializer(data={"titel": "", "description": "", "opgavebestanden": "", "vak": "", "deadline": ""})
        self.assertRaises(ValidationError, serializer.is_valid, raise_exception=True)