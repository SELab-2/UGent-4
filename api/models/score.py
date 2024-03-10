from django.db import models


class Score(models.Model):
    score = models.SmallIntegerField()
    indiening = models.ForeignKey("Indiening", on_delete=models.CASCADE)
    groep = models.ForeignKey("Groep", on_delete=models.CASCADE)

    def __str__(self):
        return self.score
