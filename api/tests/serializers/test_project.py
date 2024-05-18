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
                "extra_deadline",
                "max_score",
                "aantal_groepen",
                "max_groep_grootte",
                "student_groep",
                "zichtbaar",
                "gearchiveerd",
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

    def test_max_groep_grootte_field_content(self):
        data = self.serializer.data
        self.assertGreaterEqual(data["max_groep_grootte"], 1)

    def test_deadline_field_content(self):
        data = self.serializer.data
        self.assertEqual(parse(data["deadline"]), self.project.deadline)

    def test_extra_deadline_field_content(self):
        data = self.serializer.data
        self.assertEqual(parse(data["extra_deadline"]), self.project.extra_deadline)

    def test_zichtbaar_field_content(self):
        data = self.serializer.data
        self.assertEqual(data["zichtbaar"], self.project.zichtbaar)

    def test_gearchiveerd_field_content(self):
        data = self.serializer.data
        self.assertEqual(data["gearchiveerd"], self.project.gearchiveerd)

    def test_validation_for_blank_items(self):
        serializer = ProjectSerializer(
            data={
                "titel": "",
                "beschrijving": "",
                "opgave_bestand": "",
                "vak": "",
                "deadline": "",
                "extra_deadline": "",
                "max_score": "",
                'aantal_groepen': "",
                "max_groep_grootte": "",
                "zichtbaar": "",
                "gearchiveerd": "",
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
            "extra_deadline": self.serializer.data["extra_deadline"],
            "max_score": 20,
            'aantal_groepen': 50,
            "max_groep_grootte": 1,
            "zichtbaar": True,
            "gearchiveerd": False,
        }
        serializer = ProjectSerializer(data=data)
        self.assertTrue(serializer.is_valid())
        project = serializer.save()
        self.assertEqual(project.deadline, parse(data["deadline"]))

    def test_create_no_deadline(self):
        vak = VakFactory.create().vak_id
        data = {
            "titel": "test project",
            "beschrijving": "Dit is een test project.",
            "opgave_bestand": SimpleUploadedFile("file.txt", b"file_content"),
            "vak": vak,
            "deadline": None,
            "extra_deadline": None,
            "max_score": 20,
            'aantal_groepen': 50,
            "max_groep_grootte": 1,
            "zichtbaar": True,
            "gearchiveerd": False,
        }
        serializer = ProjectSerializer(data=data)
        self.assertTrue(serializer.is_valid())
        project = serializer.save()
        self.assertEqual(project.deadline, data["deadline"])

    def test_create_invalid_deadline(self):
        vak = VakFactory.create().vak_id
        data = {
            "titel": "test project",
            "beschrijving": "Dit is een test project.",
            "opgave_bestand": SimpleUploadedFile("file.txt", b"file_content"),
            "vak": vak,
            "deadline": datetime.now() - timedelta(days=1),
            "extra_deadline": self.serializer.data["extra_deadline"],
            "max_score": 20,
            'aantal_groepen': 50,
            "max_groep_grootte": 1,
            "zichtbaar": True,
            "gearchiveerd": False,
        }
        serializer = ProjectSerializer(data=data)
        self.assertTrue(serializer.is_valid())
        self.assertRaises(ValidationError, serializer.save, raise_exception=True)

    def test_create_invalid_extra_deadline(self):
        vak = VakFactory.create().vak_id
        data = {
            "titel": "test project",
            "beschrijving": "Dit is een test project.",
            "opgave_bestand": SimpleUploadedFile("file.txt", b"file_content"),
            "vak": vak,
            "deadline": self.serializer.data["deadline"],
            "extra_deadline": datetime.now() - timedelta(days=1),
            "max_score": 20,
            'aantal_groepen': 50,
            "max_groep_grootte": 1,
            "zichtbaar": True,
            "gearchiveerd": False,
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
            "extra_deadline": self.serializer.data["extra_deadline"],
            "max_score": 20,
            "aantal_groepen": 50,
            "max_groep_grootte": 1,
            "zichtbaar": True,
            "gearchiveerd": False,
        }
        serializer = ProjectSerializer(instance=self.project, data=data, partial=True)
        self.assertTrue(serializer.is_valid())
        project = serializer.save()
        self.assertEqual(project.deadline, parse(data["deadline"]))

    def test_update_invalid_vak(self):
        vak = VakFactory.create()
        data = self.serializer.data
        data["vak"] = vak.vak_id
        data["opgave_bestand"] = SimpleUploadedFile("file.txt", b"file_content")
        serializer = ProjectSerializer(instance=self.project, data=data, partial=True)
        self.assertTrue(serializer.is_valid())
        self.assertRaises(ValidationError, serializer.save, raise_exception=True)
