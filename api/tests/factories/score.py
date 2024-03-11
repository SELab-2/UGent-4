import factory
from api.models.score import Score


class ScoreFactory(factory.django.DjangoModelFactory):
    class Meta:
        model = Score
