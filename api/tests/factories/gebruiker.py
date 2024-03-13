import factory
from django.contrib.auth.models import User
from api.models.gebruiker import Gebruiker
from factory.django import DjangoModelFactory
from factory import SubFactory, Faker


class UserFactory(DjangoModelFactory):
    class Meta:
        model = User

    first_name = Faker('first_name')
    last_name = Faker('last_name')
    email = Faker('email')


class GebruikerFactory(DjangoModelFactory):
    class Meta:
        model = Gebruiker

    user = SubFactory(UserFactory)
    is_lesgever = Faker('boolean')