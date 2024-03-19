from rest_framework.test import APITestCase
from rest_framework.exceptions import ValidationError
from api.serializers.project import ProjectSerializer
from api.tests.factories.project import ProjectFactory
from dateutil.parser import parse
from api.tests.factories.vak import VakFactory
from django.core.files.uploadedfile import SimpleUploadedFile
from datetime import datetime, timedelta


class ProjectSerializerTest(APITestCase):
    def setUp(self):
        self.project = ProjectFactory.create()
        self.serializer = ProjectSerializer(instance=self.project)

    def test_contains_expected_fields(self):
        data = self.serializer.data
        self.assertCountEqual(
            data.keys(),
            [
                "project_id",
                "titel",
                "beschrijving",
                "opgave_bestand",
                "vak",
                "deadline",
                "max_score",
            ],
        )

    def test_titel_field_content(self):
        data = self.serializer.data
        self.assertEqual(data["titel"], self.project.titel)

    def test_beschrijving_field_content(self):
        data = self.serializer.data
        self.assertEqual(data["beschrijving"], self.project.beschrijving)

    def test_opgave_bestand_field_content(self):
        data = self.serializer.data
        self.assertEqual(
            data["opgave_bestand"].lstrip("/"), str(self.project.opgave_bestand)
        )

    def test_vak_field_content(self):
        data = self.serializer.data
        self.assertEqual(data["vak"], self.project.vak.vak_id)

    def test_max_score_field_content(self):
        data = self.serializer.data
        self.assertGreaterEqual(data["max_score"], 10)
        self.assertLessEqual(data["max_score"], 100)

    def test_deadline_field_content(self):
        data = self.serializer.data
        self.assertEqual(parse(data["deadline"]), self.project.deadline)

    def test_validation_for_blank_items(self):
        serializer = ProjectSerializer(
            data={
                "titel": "",
                "beschrijving": "",
                "opgave_bestand": "",
                "vak": "",
                "deadline": "",
                "max_score": "",
            }
        )
        self.assertRaises(ValidationError, serializer.is_valid, raise_exception=True)

    def test_create(self):
        vak = VakFactory.create().vak_id
        data = {
            "titel": "test project",
            "beschrijving": "Dit is een test project.",
            "opgave_bestand": SimpleUploadedFile("file.txt", b"file_content"),
            "vak": vak,
            "deadline": self.serializer.data["deadline"],
            "max_score": 20,
        }
        serializer = ProjectSerializer(data=data)
        self.assertTrue(serializer.is_valid())
        project = serializer.save()
        self.assertEqual(project.deadline, parse(data["deadline"]))

    def test_create_invalid_deadline(self):
        vak = VakFactory.create().vak_id
        data = {
            "titel": "test project",
            "beschrijving": "Dit is een test project.",
            "opgave_bestand": SimpleUploadedFile("file.txt", b"file_content"),
            "vak": vak,
            "deadline": datetime.now() - timedelta(days=1),
            "max_score": 20,
        }
        serializer = ProjectSerializer(data=data)
        self.assertTrue(serializer.is_valid())
        self.assertRaises(ValidationError, serializer.save, raise_exception=True)

    def test_update(self):
        data = {
            "titel": "test project",
            "beschrijving": "Dit is een test project.",
            "opgave_bestand": SimpleUploadedFile("file.txt", b"file_content"),
            "vak": self.serializer.data["vak"],
            "deadline": self.serializer.data["deadline"],
            "max_score": 20,
        }
        serializer = ProjectSerializer(instance=self.project, data=data, partial=True)
        self.assertTrue(serializer.is_valid())
        project = serializer.save()
        self.assertEqual(project.deadline, parse(data["deadline"]))
