from rest_framework.test import APITestCase
from rest_framework.exceptions import ValidationError
from api.serializers.vak import VakSerializer
from api.tests.factories.vak import VakFactory
from api.tests.factories.gebruiker import GebruikerFactory


class VakSerializerTest(APITestCase):
    def setUp(self):
        self.students = GebruikerFactory.create_batch(3, is_lesgever=False)
        self.teachers = GebruikerFactory.create_batch(2, is_lesgever=True)
        self.vak = VakFactory.create()
        self.vak.students.set(self.students)
        self.vak.teachers.set(self.teachers)
        self.serializer = VakSerializer(instance=self.vak)

    def test_contains_expected_fields(self):
        data = self.serializer.data
        self.assertCountEqual(
            data.keys(), ["vak_id", "name", "students", "teachers"]
        )  # geen projects hier?

    def test_vak_id_field_content(self):
        data = self.serializer.data
        self.assertEqual(data["vak_id"], self.vak.vak_id)

    def test_name_field_content(self):
        data = self.serializer.data
        self.assertEqual(data["name"], self.vak.name)

    def test_students_field_content(self):
        data = self.serializer.data
        self.assertCountEqual(
            data["students"], [student.pk for student in self.students]
        )

    def test_teachers_field_content(self):
        data = self.serializer.data
        self.assertCountEqual(
            data["teachers"], [teacher.pk for teacher in self.teachers]
        )

    def test_validation_for_blank_items(self):
        serializer = VakSerializer(
            data={
                "vak_id": "",
                "name": "",
                "students": [],
                "teachers": [],
                "projects": [],
            }
        )
        self.assertRaises(ValidationError, serializer.is_valid, raise_exception=True)
