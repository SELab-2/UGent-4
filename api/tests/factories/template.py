import factory
from factory.django import FileField
from api.models.template import Template
from api.tests.factories.gebruiker import UserFactory


class TemplateFactory(factory.django.DjangoModelFactory):
    class Meta:
        model = Template

    user = factory.SubFactory(UserFactory)
    bestand = FileField(filename="template.txt", data=b"file content")
