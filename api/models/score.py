from django.db import models


class Score(models.Model):
    score_id = models.AutoField(primary_key=True)
    score = models.SmallIntegerField()
    indiening = models.ForeignKey('Indiening', on_delete=models.CASCADE)

    def __str__(self):
        return self.score_id
