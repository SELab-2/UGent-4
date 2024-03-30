from django.test import TestCase
from rest_framework.exceptions import ValidationError
from api.tests.factories.restrictie import RestrictieFactory
from api.serializers.restrictie import RestrictieSerializer
from django.core.files.uploadedfile import SimpleUploadedFile
from api.tests.factories.project import ProjectFactory


class RestrictieSerializerTest(TestCase):
    def setUp(self):
        self.restrictie = RestrictieFactory.create()
        self.serializer = RestrictieSerializer(instance=self.restrictie)

    def test_contains_expected_fields(self):
        data = self.serializer.data
        self.assertCountEqual(
            data.keys(), ["restrictie_id", "project", "script", "moet_slagen"]
        )

    def test_restrictie_id_field_content(self):
        data = self.serializer.data
        self.assertEqual(data["restrictie_id"], self.restrictie.restrictie_id)

    def test_project_field_content(self):
        data = self.serializer.data
        self.assertEqual(data["project"], self.restrictie.project.project_id)

    def test_script_field_content(self):
        data = self.serializer.data
        path = self.restrictie.script.path.split("/")
        self.assertEqual(data["script"], "/" + "/".join(path[-4:]))

    def test_moet_slagen_field_content(self):
        data = self.serializer.data
        self.assertEqual(data["moet_slagen"], self.restrictie.moet_slagen)

    def test_create(self):
        data = {
            "project": self.restrictie.project.project_id,
            "script": SimpleUploadedFile("script.sh", b"file_content"),
            "moet_slagen": False,
        }
        serializer = RestrictieSerializer(data=data)
        self.assertTrue(serializer.is_valid())
        restrictie = serializer.save()
        self.assertEqual(restrictie.project.project_id, data["project"])
        path = restrictie.script.path.split("/")
        filename = path[-1]
        filename = filename.split("_")[0]
        filename = filename.split(".")[0] + ".sh"
        self.assertEqual(
            "/".join(path[-4:-1]) + "/" + filename,
            f"data/restricties/project_{restrictie.project.project_id}/"
            + str(data["script"]),
        )
        self.assertEqual(restrictie.moet_slagen, data["moet_slagen"])
    
    def test_create_invalid_script(self):
        data = {
            "project": self.restrictie.project.project_id,
            "script": SimpleUploadedFile("script.txt", b"file_content"),
            "moet_slagen": False,
        }
        serializer = RestrictieSerializer(data=data)
        self.assertTrue(serializer.is_valid())
        self.assertRaises(ValidationError, serializer.save, raise_exception=True)

    def test_update(self):
        data = self.serializer.data
        data["script"] = SimpleUploadedFile(data["script"], b"file_content")
        data["moet_slagen"] = not data["moet_slagen"]
        serializer = RestrictieSerializer(
            instance=self.restrictie, data=data, partial=True
        )
        self.assertTrue(serializer.is_valid())
        self.restrictie = serializer.save()
        self.assertEqual(self.restrictie.moet_slagen, data["moet_slagen"])
    
    def test_update_invalid_project(self):
        project = ProjectFactory.create()
        data = self.serializer.data
        data["project"] = project.project_id
        data["script"] = SimpleUploadedFile(data["script"], b"file_content")
        serializer = RestrictieSerializer(
            instance=self.restrictie, data=data, partial=True
        )
        self.assertTrue(serializer.is_valid())
        self.assertRaises(ValidationError, serializer.save, raise_exception=True)


    def test_validation_for_blank_items(self):
        serializer = RestrictieSerializer(
            data={"project": "", "script": "", "moet_slagen": ""}
        )
        self.assertRaises(ValidationError, serializer.is_valid, raise_exception=True)
