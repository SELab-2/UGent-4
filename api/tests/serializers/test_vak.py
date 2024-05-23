from rest_framework.test import APITestCase
from rest_framework.exceptions import ValidationError
from api.serializers.vak import VakSerializer
from api.tests.factories.vak import VakFactory
from api.tests.factories.gebruiker import GebruikerFactory
from api.tests.factories.project import ProjectFactory
from api.tests.factories.groep import GroepFactory


class VakSerializerTest(APITestCase):
    def setUp(self):
        self.vak_data = VakFactory.create()
        self.serializer = VakSerializer(instance=self.vak_data)

    def test_contains_expected_fields(self):
        data = self.serializer.data
        self.assertCountEqual(
            data.keys(),
            ["vak_id", "naam", "jaartal", "gearchiveerd", "studenten", "lesgevers"],
        )

    def test_vak_id_field_content(self):
        data = self.serializer.data
        self.assertEqual(data["vak_id"], self.vak_data.vak_id)

    def test_naam_field_content(self):
        data = self.serializer.data
        self.assertEqual(data["naam"], self.vak_data.naam)

    def test_studenten_field_content(self):
        data = self.serializer.data
        self.assertEqual(
            set(data["studenten"]),
            set([student.user.id for student in self.vak_data.studenten.all()]),
        )

    def test_lesgevers_field_content(self):
        data = self.serializer.data
        self.assertEqual(
            set(data["lesgevers"]),
            set([teacher.user.id for teacher in self.vak_data.lesgevers.all()]),
        )

    def test_validation_for_blank_items(self):
        serializer = VakSerializer(
            data={
                "vak_id": "",
                "naam": "",
                "studenten": [],
                "lesgevers": [],
            }
        )
        self.assertRaises(ValidationError, serializer.is_valid, raise_exception=True)

    def test_create(self):
        students_data = [
            GebruikerFactory.create(is_lesgever=False).user.id for _ in range(3)
        ]
        teachers_data = [
            GebruikerFactory.create(is_lesgever=True).user.id for _ in range(3)
        ]
        data = {
            "naam": "test vak",
            "studenten": students_data,
            "lesgevers": teachers_data,
        }
        serializer = VakSerializer(data=data)
        self.assertTrue(serializer.is_valid())
        vak = serializer.save()
        self.assertEqual(
            set(students_data),
            set([student.user.id for student in vak.studenten.all()]),
        )
        self.assertEqual(
            set(teachers_data),
            set([teacher.user.id for teacher in vak.lesgevers.all()]),
        )
        self.assertEqual(vak.naam, "test vak")

    def test_create_invalid_students(self):
        students_data = [
            GebruikerFactory.create(is_lesgever=True).user.id for _ in range(3)
        ]
        teachers_data = [
            GebruikerFactory.create(is_lesgever=True).user.id for _ in range(3)
        ]
        data = {
            "naam": "test vak",
            "studenten": students_data,
            "lesgevers": teachers_data,
        }
        serializer = VakSerializer(data=data)
        self.assertTrue(serializer.is_valid())
        self.assertRaises(ValidationError, serializer.save, raise_exception=True)

    def test_create_invalid_teachers(self):
        students_data = [
            GebruikerFactory.create(is_lesgever=False).user.id for _ in range(3)
        ]
        teachers_data = [
            GebruikerFactory.create(is_lesgever=False).user.id for _ in range(3)
        ]
        data = {
            "naam": "test vak",
            "studenten": students_data,
            "lesgevers": teachers_data,
        }
        serializer = VakSerializer(data=data)
        self.assertTrue(serializer.is_valid())
        self.assertRaises(ValidationError, serializer.save, raise_exception=True)

    def test_update(self):
        students_data = [
            GebruikerFactory.create(is_lesgever=False).user.id for _ in range(3)
        ]
        teachers_data = [
            GebruikerFactory.create(is_lesgever=True).user.id for _ in range(3)
        ]
        data = {
            "naam": "nieuw vak",
            "studenten": students_data,
            "lesgevers": teachers_data,
        }
        serializer = VakSerializer(instance=self.vak_data, data=data, partial=True)
        self.assertTrue(serializer.is_valid())
        vak = serializer.save()
        self.assertEqual(
            set(students_data),
            set([student.user.id for student in vak.studenten.all()]),
        )
        self.assertEqual(
            set(teachers_data),
            set([teacher.user.id for teacher in vak.lesgevers.all()]),
        )
        self.assertEqual(vak.naam, "nieuw vak")

    def test_add_students_to_groep(self):
        students_data = [
            GebruikerFactory.create(is_lesgever=False).user.id for _ in range(3)
        ]
        teachers_data = [
            GebruikerFactory.create(is_lesgever=True).user.id for _ in range(3)
        ]
        data = {
            "naam": "test vak",
            "studenten": students_data,
            "lesgevers": teachers_data,
        }
        serializer = VakSerializer(instance=self.vak_data, data=data, partial=True)
        self.assertTrue(serializer.is_valid())
        vak = serializer.save()
        project = ProjectFactory.create(
            student_groep=True, max_groep_grootte=1, vak=vak
        )
        serializer = VakSerializer(instance=self.vak_data, data=data, partial=True)
        self.assertTrue(serializer.is_valid())
        vak = serializer.save()
        self.assertEqual(project.vak, vak)

    def test_add_invalid_students_to_group(self):
        students_data = [
            GebruikerFactory.create(is_lesgever=False).user.id for _ in range(3)
        ]
        teachers_data = [
            GebruikerFactory.create(is_lesgever=True).user.id for _ in range(3)
        ]
        data = {
            "naam": "test vak",
            "studenten": students_data,
            "lesgevers": teachers_data,
        }
        serializer = VakSerializer(instance=self.vak_data, data=data, partial=True)
        self.assertTrue(serializer.is_valid())
        vak = serializer.save()
        project = ProjectFactory.create(
            student_groep=True, max_groep_grootte=1, vak=vak
        )
        # voeg een student toe aan een groep
        GroepFactory.create(project=project, studenten=[vak.studenten.all()[0]])
        # nu zal de serializer alle studenten aan een groep toevoegen, maar eentje zit dus al in een groep
        serializer = VakSerializer(instance=self.vak_data, data=data, partial=True)
        self.assertTrue(serializer.is_valid())
        vak = serializer.save()

    def test_add_students_to_group_with_max_groep_grootte(self):
        students_data = [
            GebruikerFactory.create(is_lesgever=False).user.id for _ in range(3)
        ]
        teachers_data = [
            GebruikerFactory.create(is_lesgever=True).user.id for _ in range(3)
        ]
        data = {
            "naam": "test vak",
            "studenten": students_data,
            "lesgevers": teachers_data,
        }
        serializer = VakSerializer(instance=self.vak_data, data=data, partial=True)
        self.assertTrue(serializer.is_valid())
        vak = serializer.save()
        project = ProjectFactory.create(
            student_groep=False, max_groep_grootte=2, vak=vak
        )
        serializer = VakSerializer(instance=self.vak_data, data=data, partial=True)
        self.assertTrue(serializer.is_valid())
        vak = serializer.save()
        self.assertEqual(project.vak, vak)
