from rest_framework.test import APITestCase
from rest_framework.exceptions import ValidationError
from api.serializers.groep import GroepSerializer
from api.tests.factories.groep import GroepFactory
from api.tests.factories.gebruiker import GebruikerFactory
from api.tests.factories.project import ProjectFactory


class GroepSerializerTest(APITestCase):
    def setUp(self):
        self.groep = GroepFactory.create()
        self.serializer = GroepSerializer(instance=self.groep)

    def test_contains_expected_fields(self):
        data = self.serializer.data
        self.assertCountEqual(data.keys(), ["groep_id", "project", "studenten"])

    def test_project_field_content(self):
        data = self.serializer.data
        self.assertEqual(data["project"], self.groep.project.project_id)

    def test_studenten_field_content(self):
        data = self.serializer.data
        students = [student.user.id for student in self.groep.studenten.all()]
        self.assertEqual(data["studenten"], students)

    def test_create(self):
        studenten = [
            GebruikerFactory.create(is_lesgever=False).user.id for _ in range(3)
        ]
        for student in studenten:
            self.groep.project.vak.studenten.add(student)
        data = {
            "project": self.groep.project.project_id,
            "studenten": studenten,
        }
        serializer = GroepSerializer(data=data)
        self.assertTrue(serializer.is_valid())
        groep = serializer.save()
        self.assertEqual(groep.project.project_id, data["project"])
        self.assertEqual(
            set([student.user.id for student in groep.studenten.all()]),
            set(data["studenten"]),
        )

    def test_create_invalid_user_already_in_a_group(self):
        student = GebruikerFactory.create(is_lesgever=False).user.id
        self.groep.project.vak.studenten.add(student)
        data = {
            "project": self.groep.project.project_id,
            "studenten": [student],
        }
        serializer = GroepSerializer(data=data)
        self.assertTrue(serializer.is_valid())
        groep = serializer.save()
        self.assertEqual(groep.project.project_id, data["project"])
        self.assertEqual(
            set([student.user.id for student in groep.studenten.all()]),
            set(data["studenten"]),
        )
        new_data = {
            "project": self.groep.project.project_id,
            "studenten": [student],
        }
        newserializer = GroepSerializer(data=new_data)
        self.assertTrue(newserializer.is_valid())
        self.assertRaises(ValidationError, newserializer.save, raise_exception=True)

    def test_create_invalid_user_not_in_vak(self):
        student = GebruikerFactory.create(is_lesgever=False).user.id
        data = {
            "project": self.groep.project.project_id,
            "studenten": [student],
        }
        serializer = GroepSerializer(data=data)
        self.assertTrue(serializer.is_valid())
        self.assertRaises(ValidationError, serializer.save, raise_exception=True)

    def test_create_invalid_user_is_teacher(self):
        data = {
            "project": self.groep.project.project_id,
            "studenten": [
                GebruikerFactory.create(is_lesgever=True).user.id for _ in range(3)
            ],
        }
        serializer = GroepSerializer(data=data)
        self.assertTrue(serializer.is_valid())
        self.assertRaises(ValidationError, serializer.save, raise_exception=True)

    def test_update(self):
        data = self.serializer.data
        student = GebruikerFactory.create(is_lesgever=False).user.id
        self.groep.project.vak.studenten.add(student)
        data["studenten"].append(student)
        serializer = GroepSerializer(instance=self.groep, data=data, partial=True)
        self.assertTrue(serializer.is_valid())
        groep = serializer.save()
        self.assertEqual(
            [student.user.id for student in groep.studenten.all()], data["studenten"]
        )
    
    def test_update_invalid_project(self):
        project = ProjectFactory.create(vak=self.groep.project.vak)
        data = self.serializer.data
        data['project'] = project.project_id
        serializer = GroepSerializer(instance=self.groep, data=data, partial=True)
        self.assertTrue(serializer.is_valid())
        self.assertRaises(ValidationError, serializer.save, raise_exception=True)


    def test_update_invalid_user_already_in_this_group(self):
        data = self.serializer.data
        self.assertEqual(len(data["studenten"]), 1)
        student = GebruikerFactory.create(is_lesgever=False).user.id
        self.groep.project.vak.studenten.add(student)
        data["studenten"].append(student)
        serializer = GroepSerializer(instance=self.groep, data=data, partial=True)
        self.assertTrue(serializer.is_valid())
        groep = serializer.save()
        self.assertEqual(
            [student.user.id for student in groep.studenten.all()], data["studenten"]
        )
        new_data = self.serializer.data
        new_data["studenten"].append(student)
        serializer = GroepSerializer(instance=groep, data=new_data, partial=True)
        self.assertTrue(serializer.is_valid())
        self.assertRaises(ValidationError, serializer.save, raise_exception=True)

    def test_update_invalid_user_not_in_vak(self):
        data = self.serializer.data
        serializer = GroepSerializer(instance=self.groep, data=data, partial=True)
        self.assertTrue(serializer.is_valid())
        groep = serializer.save()
        self.assertEqual(
            [student.user.id for student in groep.studenten.all()], data["studenten"]
        )
        new_data = self.serializer.data
        new_data["studenten"].append(GebruikerFactory.create(is_lesgever=False).user.id)
        serializer = GroepSerializer(instance=groep, data=new_data, partial=True)
        self.assertTrue(serializer.is_valid())
        self.assertRaises(ValidationError, serializer.save, raise_exception=True)

    def test_validation_for_blank_items(self):
        serializer = GroepSerializer(data={"project": "", "studenten": []})
        self.assertRaises(ValidationError, serializer.is_valid, raise_exception=True)
