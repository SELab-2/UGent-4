import factory
from api.models.groep import Groep
from factory.django import DjangoModelFactory
from factory import SubFactory
from api.tests.factories.gebruiker import GebruikerFactory
from api.tests.factories.project import ProjectFactory


class GroepFactory(DjangoModelFactory):
    class Meta:
        model = Groep

    project = SubFactory(ProjectFactory)

    @factory.post_generation
    def studenten(self, create, extracted, **kwargs):
        if not create:
            return

        if extracted:
            for student in extracted:
                self.studenten.add(student)
        else:
            student = GebruikerFactory(is_lesgever=False)
            self.project.vak.studenten.add(student)
            self.studenten.add(student)
