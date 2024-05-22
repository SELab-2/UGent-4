import factory
from api.models.project import Project
from factory.django import DjangoModelFactory
from factory import SubFactory
from django.utils import timezone
from .vak import VakFactory
from faker import Faker

fake = Faker()


class ProjectFactory(DjangoModelFactory):
    class Meta:
        model = Project

    titel = factory.Faker("word")
    beschrijving = factory.Faker("paragraph")
    opgave_bestand = factory.django.FileField(data=b"file content")
    vak = SubFactory(VakFactory)
    deadline = factory.LazyFunction(
        lambda: timezone.make_aware(
            fake.date_time_between(start_date="+1d", end_date="+30d")
        )
    )
    extra_deadline = factory.LazyFunction(
        lambda: timezone.make_aware(
            fake.date_time_between(start_date="+30d", end_date="+40d")
        )
    )
    max_score = factory.Faker("random_int", min=10, max=100)
    max_groep_grootte = factory.Faker("random_int", min=1, max=5)
    student_groep = factory.Faker("boolean")
    zichtbaar = factory.Faker("boolean")
    gearchiveerd = factory.Faker("boolean")
