import factory
from api.models.groep import Groep
from api.tests.factories.gebruiker import GebruikerFactory
from api.tests.factories.project import ProjectFactory


class GroepFactory(factory.django.DjangoModelFactory):
    class Meta:
        model = Groep

    project = factory.SubFactory(ProjectFactory)

    @factory.post_generation
    def students(self, create, extracted, **kwargs):
        if not create:
            return

        if extracted:
            for student in extracted:
                self.students.add(student)
        else:
            self.students.add(GebruikerFactory())
