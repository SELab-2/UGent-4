import factory
from api.models.vak import Vak


class VakFactory(factory.django.DjangoModelFactory):
    class Meta:
        model = Vak

    name = factory.Faker("word")
