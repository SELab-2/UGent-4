from django.contrib.auth.models import User
from api.models.gebruiker import Gebruiker
import factory

class UserFactory(factory.django.DjangoModelFactory):
    class Meta:
        model = User

    username = factory.Sequence(lambda n: f'user{n}')
    password = factory.PostGenerationMethodCall('set_password', 'password')

class GebruikerFactory(factory.django.DjangoModelFactory):
    class Meta:
        model = Gebruiker

    user = factory.SubFactory(UserFactory)
    is_lesgever = False
