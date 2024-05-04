import factory
from api.models.vak import Vak
from factory.django import DjangoModelFactory
from factory import Faker
from .gebruiker import GebruikerFactory
from datetime import date


class VakFactory(DjangoModelFactory):
    class Meta:
        model = Vak

    jaartal = factory.LazyFunction(lambda: date.today().year)
    gearchiveerd = False

    @factory.post_generation
    def studenten(self, create, extracted, **kwargs):
        if not create:
            return

        if extracted:
            for gebruiker in extracted:
                self.studenten.add(gebruiker)
        else:
            self.studenten.add(GebruikerFactory(is_lesgever=False))

    @factory.post_generation
    def lesgevers(self, create, extracted, **kwargs):
        if not create:
            return

        if extracted:
            for lesgever in extracted:
                self.lesgevers.add(lesgever)
        else:
            self.lesgevers.add(GebruikerFactory(is_lesgever=True))
