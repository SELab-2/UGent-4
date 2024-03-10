import factory
from api.models.indiening import Indiening
from api.models.groep import Groep
from django.core.files.base import ContentFile

class GroepFactory(factory.django.DjangoModelFactory):
    class Meta:
        model = Groep

    # Add fields here. For example:
    # field_name = factory.Faker('pystr')

class IndieningFactory(factory.django.DjangoModelFactory):
    class Meta:
        model = Indiening

    indiener = factory.SubFactory(GroepFactory)
    indieningsbestanden = factory.django.FileField(from_path=ContentFile(b"file content"))
    tijdstip = factory.Faker('date_time_this_year')