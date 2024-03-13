import factory
from api.models.score import Score
from factory.django import DjangoModelFactory
from factory import SubFactory, Faker
from api.tests.factories.indiening import IndieningFactory


class ScoreFactory(DjangoModelFactory):
    class Meta:
        model = Score

    score = Faker("random_int", min=0, max=100)
    indiening = SubFactory(IndieningFactory)
