import factory
from factory.django import DjangoModelFactory
from api.models.restrictie import Restrictie
from api.tests.factories.project import ProjectFactory


class RestrictieFactory(DjangoModelFactory):
    class Meta:
        model = Restrictie

    project = factory.SubFactory(ProjectFactory)
    script = factory.django.FileField(filename="test_script.sh")
    moet_slagen = factory.Faker("boolean")
