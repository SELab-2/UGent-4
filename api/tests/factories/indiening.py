import factory
from api.models.indiening import Indiening, IndieningBestand
from factory.django import DjangoModelFactory
from factory import SubFactory
from .groep import GroepFactory
from django.utils import timezone
from factory.django import FileField
from faker import Faker


fake = Faker()


class IndieningFactory(DjangoModelFactory):
    class Meta:
        model = Indiening

    groep = SubFactory(GroepFactory)
    tijdstip = factory.LazyFunction(
        lambda: timezone.make_aware(
            fake.date_time_between(start_date="+1d", end_date="+30d")
        )
    )
    status = factory.Faker("boolean")
    result = factory.Faker("paragraph")

    indiening_bestanden = factory.RelatedFactory(
        "api.tests.factories.indiening.IndieningBestandFactory", "indiening"
    )


class IndieningBestandFactory(DjangoModelFactory):
    class Meta:
        model = IndieningBestand

    indiening = SubFactory(IndieningFactory)
    bestand = FileField(filename="test.txt", data=b"file content")
