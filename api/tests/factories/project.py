from django.utils import timezone
import factory
from api.models.project import Project
from api.tests.factories.vak import VakFactory
from faker import Faker

fake = Faker()


class ProjectFactory(factory.django.DjangoModelFactory):
    class Meta:
        model = Project

    titel = factory.Faker("sentence", nb_words=4)
    description = factory.Faker("paragraph")
    opgavebestanden = factory.django.FileField(filename="opgave.pdf")
    vak = factory.SubFactory(VakFactory)
    deadline = factory.LazyFunction(
        lambda: timezone.make_aware(
            fake.date_time_between(start_date="+1d", end_date="+30d")
        )
    )
