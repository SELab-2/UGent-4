from django.test import TestCase
from api.tests.factories.vak import VakFactory

class VakModelTest(TestCase):
    def setUp(self):
        self.vak = VakFactory.create()

    def test_str_method(self):
        self.assertEqual(str(self.vak), self.vak.name)

    def test_vak_id_label(self):
        field_label = self.vak._meta.get_field('vak_id').verbose_name
        self.assertEqual(field_label, 'vak id')

    def test_name_label(self):
        field_label = self.vak._meta.get_field('name').verbose_name
        self.assertEqual(field_label, 'name')

    def test_students_label(self):
        field_label = self.vak._meta.get_field('students').verbose_name
        self.assertEqual(field_label, 'students')

    def test_teachers_label(self):
        field_label = self.vak._meta.get_field('teachers').verbose_name
        self.assertEqual(field_label, 'teachers')