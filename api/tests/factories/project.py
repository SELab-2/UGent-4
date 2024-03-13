import factory
from api.models.project import Project
from django.core.files.base import ContentFile
from factory.django import DjangoModelFactory
from factory import SubFactory, Faker
from django.utils import timezone
from .vak import VakFactory

fake = Faker('provider')

class ProjectFactory(DjangoModelFactory):
    class Meta:
        model = Project

    project_id = factory.Sequence(lambda n: n)
    titel = Faker('title')
    beschrijving = Faker('paragraph')
    opgave_bestand = factory.django.FileField(data=b"file content")
    vak = SubFactory(VakFactory)
    deadline = factory.LazyFunction(
        lambda: timezone.make_aware(
            fake.date_time_between(start_date="+1d", end_date="+30d")
        )
    )
    max_score = Faker('random_int', min=10, max=30)