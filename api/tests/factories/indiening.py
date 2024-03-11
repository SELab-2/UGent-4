import factory
from api.models.indiening import Indiening
from api.tests.factories.groep import GroepFactory
from django.utils import timezone
from faker import Faker

fake = Faker()


class IndieningFactory(factory.django.DjangoModelFactory):
    class Meta:
        model = Indiening

    indiener = factory.SubFactory(GroepFactory)
    indieningsbestanden = factory.django.FileField(data=b"file content")
    tijdstip = factory.LazyFunction(
        lambda: timezone.make_aware(
            fake.date_time_between(start_date="+1d", end_date="+30d")
        )
    )
