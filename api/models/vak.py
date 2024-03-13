from django.db import models


class Vak(models.Model):
    vak_id = models.AutoField(primary_key=True)
    naam = models.CharField(max_length=100)
    studenten = models.ManyToManyField(
        "Gebruiker", related_name="vak_gebruikers", blank=True
    )
    lesgevers = models.ManyToManyField(
        "Gebruiker", related_name="vak_lesgevers", blank=True
    )

    def __str__(self):
        return self.naam
