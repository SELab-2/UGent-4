from rest_framework.test import APITestCase
from rest_framework.exceptions import ValidationError
from api.serializers.gebruiker import GebruikerSerializer
from api.tests.factories.gebruiker import UserFactory, GebruikerFactory
from api.tests.factories.vak import VakFactory


class GebruikerSerializerTest(APITestCase):
    def setUp(self):
        self.user = UserFactory.create()
        self.gebruiker = GebruikerFactory.create(user=self.user, is_lesgever=False)
        self.serializer = GebruikerSerializer(instance=self.gebruiker)

    def test_contains_expected_fields(self):
        data = self.serializer.data
        self.assertCountEqual(
            data.keys(),
            [
                "user",
                "is_lesgever",
                "first_name",
                "last_name",
                "email",
                "gepinde_vakken",
            ],
        )

    def test_user_field_content(self):
        data = self.serializer.data
        self.assertEqual(data["user"], self.user.id)

    def test_is_lesgever_field_content(self):
        data = self.serializer.data
        self.assertEqual(data["is_lesgever"], self.gebruiker.is_lesgever)

    def test_first_name_field_content(self):
        data = self.serializer.data
        self.assertEqual(data["first_name"], self.user.first_name)

    def test_last_name_field_content(self):
        data = self.serializer.data
        self.assertEqual(data["last_name"], self.user.last_name)

    def test_email_field_content(self):
        data = self.serializer.data
        self.assertEqual(data["email"], self.user.email)

    def test_create(self):
        data = {"user": UserFactory.create().id, "is_lesgever": False}
        serializer = GebruikerSerializer(data=data)
        self.assertTrue(serializer.is_valid())
        gebruiker = serializer.save()
        self.assertEqual(gebruiker.user.id, data["user"])
        self.assertEqual(gebruiker.is_lesgever, data["is_lesgever"])

    def test_update(self):
        vak = VakFactory.create()
        vak.studenten.add(self.gebruiker)
        data = self.serializer.data
        data["gepinde_vakken"] = [vak.vak_id]
        serializer = GebruikerSerializer(
            instance=self.gebruiker, data=data, partial=True
        )
        self.assertTrue(serializer.is_valid())
        self.gebruiker = serializer.save()
        self.assertEqual(self.gebruiker.gepinde_vakken.first(), vak)

    def test_update_invalid(self):
        self.gebruiker.is_lesgever = True
        vak = VakFactory.create()
        data = self.serializer.data
        data["gepinde_vakken"] = [vak.vak_id]
        serializer = GebruikerSerializer(
            instance=self.gebruiker, data=data, partial=True
        )
        self.assertTrue(serializer.is_valid())
        self.assertRaises(ValidationError, serializer.save, raise_exception=True)

    def test_validation_for_blank_items(self):
        serializer = GebruikerSerializer(data={"user": "", "is_lesgever": []})
        self.assertRaises(ValidationError, serializer.is_valid, raise_exception=True)
