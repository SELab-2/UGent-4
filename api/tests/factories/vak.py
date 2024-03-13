import factory
from api.models.vak import Vak
from factory.django import DjangoModelFactory
from factory import Faker
from .gebruiker import GebruikerFactory


class VakFactory(DjangoModelFactory):
    class Meta:
        model = Vak

    vak_id = factory.Sequence(lambda n: n)
    naam = Faker('name')
    studenten = factory.RelatedFactory(GebruikerFactory, 'vak_gebruikers')
    lesgevers = factory.RelatedFactory(GebruikerFactory, 'vak_lesgevers')