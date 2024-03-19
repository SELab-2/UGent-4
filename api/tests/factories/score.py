from api.models.score import Score
from factory.django import DjangoModelFactory
from factory import SubFactory
from api.tests.factories.indiening import IndieningFactory
import random

class ScoreFactory(DjangoModelFactory):
    class Meta:
        model = Score

    indiening = SubFactory(IndieningFactory)

    @classmethod
    def _create(cls, model_class, *args, **kwargs):
        indiening = kwargs.pop('indiening')
        max_score = indiening.groep.project.max_score
        kwargs['score'] = random.randint(0, max_score)
        return super()._create(model_class, indiening=indiening, *args, **kwargs)
