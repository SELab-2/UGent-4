from rest_framework.test import APITestCase
from rest_framework.exceptions import ValidationError
from api.serializers.groep import GroepSerializer
from api.tests.factories.groep import GroepFactory


class GroepSerializerTest(APITestCase):
    def setUp(self):
        self.groep = GroepFactory.create()
        self.serializer = GroepSerializer(instance=self.groep)

    def test_contains_expected_fields(self):
        data = self.serializer.data
        self.assertCountEqual(data.keys(), ["group_id", "project", "students"])

    def test_project_field_content(self):
        data = self.serializer.data
        self.assertEqual(
            data["project"], self.groep.project.pk
        )  # replace 'pk' with the correct primary key field of the Project model

    def test_students_field_content(self):
        data = self.serializer.data
        students = [student.pk for student in self.groep.students.all()]
        self.assertEqual(data["students"], students)

    def test_validation_for_blank_items(self):
        serializer = GroepSerializer(data={"project": "", "students": []})
        self.assertRaises(ValidationError, serializer.is_valid, raise_exception=True)
