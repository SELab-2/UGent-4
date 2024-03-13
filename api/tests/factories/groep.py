import factory
from api.models.groep import Groep
from factory.django import DjangoModelFactory
from factory import SubFactory
from api.tests.factories.gebruiker import GebruikerFactory
from api.tests.factories.project import ProjectFactory


class GroepFactory(DjangoModelFactory):
    class Meta:
        model = Groep

    groep_id = factory.Sequence(lambda n: n)
    project = SubFactory(ProjectFactory)

    @factory.post_generation
    def studenten(self, create, extracted, **kwargs):
        if not create:
            return

        if extracted:
            for student in extracted:
                self.studenten.add(student)
        else:
            self.students.add(GebruikerFactory())