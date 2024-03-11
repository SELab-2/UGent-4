from rest_framework.test import APITestCase
from rest_framework.exceptions import ValidationError
from api.serializers.gebruiker import GebruikerSerializer
from api.tests.factories.gebruiker import UserFactory, GebruikerFactory
from api.tests.factories.vak import VakFactory


class GebruikerSerializerTest(APITestCase):
    def setUp(self):
        self.user = UserFactory.create(username="testuser")
        self.gebruiker = GebruikerFactory.create(user=self.user)

        subjects = VakFactory.create_batch(2)
        self.gebruiker.subjects.set(subjects)

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
