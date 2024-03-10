from django.test import TestCase
from rest_framework.test import APITestCase
from rest_framework.exceptions import ValidationError
from api.models.gebruiker import Gebruiker
from api.serializers.gebruiker import GebruikerSerializer
from django.contrib.auth.models import User
from api.models.vak import Vak


class GebruikerSerializerTest(APITestCase):

    def setUp(self):
        # Create a User instance
        self.user = User.objects.create_user(username="testuser")

        self.gebruiker_attributes = {
            "user": self.user,
        }

        self.serializer_data = GebruikerSerializer().data
        self.gebruiker = Gebruiker.objects.create(**self.gebruiker_attributes)

        subjects = [1, 2]
        for subject in subjects:
            vak = Vak.objects.create(name=subject)
            self.gebruiker.subjects.add(vak)

        self.serializer = GebruikerSerializer(instance=self.gebruiker)

    def test_contains_expected_fields(self):
        data = self.serializer.data
        self.assertCountEqual(data.keys(), ["user", "is_lesgever", "subjects"])

    def test_user_field_content(self):
        data = self.serializer.data
        self.assertEqual(data["user"], self.user.id)

    def test_subjects_field_content(self):
        data = self.serializer.data
        subjects = [subject.pk for subject in self.gebruiker.subjects.all()]
        self.assertEqual(data["subjects"], subjects)

    def test_validation_for_blank_items(self):
        serializer = GebruikerSerializer(data={"name": "", "subjects": []})
        self.assertRaises(ValidationError, serializer.is_valid, raise_exception=True)
