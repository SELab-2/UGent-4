from django.test import TestCase
from api.models.gebruiker import Gebruiker
from django.contrib.auth.models import User

class GebruikerTestCase(TestCase):
    def setUp(self):
        user1 = User.objects.create_user(username='user1')
        user2 = User.objects.create_user(username='user2')
        Gebruiker.objects.create(user=user1, is_lesgever=False)
        Gebruiker.objects.create(user=user2, is_lesgever=True)

    def test_gebruiker_is_lesgever(self):
        user1 = Gebruiker.objects.get(user__username='user1')
        user2 = Gebruiker.objects.get(user__username='user2')
        self.assertEqual(user1.is_lesgever, False)
        self.assertEqual(user2.is_lesgever, True)
