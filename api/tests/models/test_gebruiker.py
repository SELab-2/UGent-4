from django.test import TestCase
from api.tests.factories.gebruiker import UserFactory, GebruikerFactory


class GebruikerModelTest(TestCase):
    def setUp(self):
        self.user1 = UserFactory.create(username="user1")
        self.user2 = UserFactory.create(username="user2")
        self.gebruiker1 = GebruikerFactory.create(user=self.user1, is_lesgever=False)
        self.gebruiker2 = GebruikerFactory.create(user=self.user2, is_lesgever=True)

    def test_gebruiker_is_lesgever(self):
        self.assertEqual(self.gebruiker1.is_lesgever, False)
        self.assertEqual(self.gebruiker2.is_lesgever, True)

    def test_str_method(self):
        expected_object_name = (
            self.gebruiker1.user.first_name + " " + self.gebruiker1.user.last_name
        )
        self.assertEqual(str(self.gebruiker1), expected_object_name)
