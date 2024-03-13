from django.db import models
from .vak import Vak

def upload_to(instance, filename):
    vak_id = instance.vak.vak_id
    return f'data/opgaves/vak_{vak_id}/{filename}'


class Project(models.Model):
    project_id = models.AutoField(primary_key=True)
    titel = models.CharField(max_length=100)
    beschrijving = models.TextField()
    opgave_bestand = models.FileField(upload_to=upload_to)
    vak = models.ForeignKey(Vak, on_delete=models.CASCADE)
    deadline = models.DateTimeField(null=True)
    max_score = models.IntegerField(default=20)
    # indiening restricties

    def __str__(self):
        return self.titel
