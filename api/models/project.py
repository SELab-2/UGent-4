from django.db import models
from .vak import Vak


class Project(models.Model):
    project_id = models.AutoField(primary_key=True)
    titel = models.CharField(max_length=100)
    description = models.TextField()
    opgavebestanden = models.FileField(upload_to="data/opgaves/")
    vak = models.ForeignKey(Vak, on_delete=models.CASCADE)
    deadline = models.DateTimeField(null=True)
    # indiening restricties

    def __str__(self):
        return self.titel
