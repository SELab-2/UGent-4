from django.test import TestCase
from api.models.gebruiker import Gebruiker
from django.contrib.auth.models import User


class GebruikerTestCase(TestCase):
    def setUp(self):
        user1 = User.objects.create_user(username="user1")
        user2 = User.objects.create_user(username="user2")
        Gebruiker.objects.create(user=user1, is_lesgever=False)
        Gebruiker.objects.create(user=user2, is_lesgever=True)

    def test_gebruiker_is_lesgever(self):
        user1 = Gebruiker.objects.get(user__username="user1")
        user2 = Gebruiker.objects.get(user__username="user2")
        self.assertEqual(user1.is_lesgever, False)
        self.assertEqual(user2.is_lesgever, True)

    def test_user_label(self):
        user = Gebruiker.objects.get(user__username="user1")
        field_label = user._meta.get_field("user").verbose_name
        self.assertEqual(field_label, "user")

    def test_subjects_label(self):
        user = Gebruiker.objects.get(user__username="user1")
        field_label = user._meta.get_field("subjects").verbose_name
        self.assertEqual(field_label, "subjects")

    def test_str_method(self):
        gebruiker = Gebruiker.objects.get(user__username="user1")
        expected_object_name = gebruiker.user.first_name
        self.assertEqual(str(gebruiker), expected_object_name)
