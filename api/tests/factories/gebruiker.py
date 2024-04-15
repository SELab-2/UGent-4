from django.contrib.auth.models import User
from api.models.gebruiker import Gebruiker
from factory.django import DjangoModelFactory
from factory import SubFactory, Faker, PostGeneration


class UserFactory(DjangoModelFactory):
    class Meta:
        model = User

    username = Faker("user_name")
    first_name = Faker("first_name")
    last_name = Faker("last_name")
    email = Faker("email")
    is_superuser = False


class GebruikerFactory(DjangoModelFactory):
    class Meta:
        model = Gebruiker

    user = SubFactory(UserFactory)
    is_lesgever = Faker("boolean")

    @PostGeneration 
    def make_superuser(self, create, extracted, **kwargs):
        if not create:
            return
        self.user.is_superuser = self.is_lesgever
        self.user.save()
    
    @PostGeneration
    def gepinde_vakken(self, create, extracted, **kwargs):
        if not create:
            return
        if extracted:
            for vak in extracted:
                self.gepinde_vakken.add(vak)
