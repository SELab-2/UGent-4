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

    @factory.post_generation
    def studenten(self, create, extracted, **kwargs):
        if not create:
            return

        if extracted:
            for gebruiker in extracted:
                self.studenten.add(gebruiker)
        else:
            self.studenten.add(GebruikerFactory())
    
    @factory.post_generation
    def lesgevers(self, create, extracted, **kwargs):
        if not create:
            return

        if extracted:
            for lesgever in extracted:
                self.lesgevers.add(lesgever)
        else:
            self.lesgevers.add(GebruikerFactory(is_lesgever=True))