from django.db import models
from django.contrib.auth.models import User
from api.models.vak import Vak


class Gebruiker(models.Model):
    """
    Model voor een gebruiker, dat zich uitbreidt op het standaardgebruikermodel van Django.

    Fields:
        user (OneToOneField): Een veld dat verwijst naar het standaardgebruikermodel van Django
        met een één-op-één-relatie. Dit veld fungeert als het primaire sleutelveld.
        is_lesgever (BooleanField): Een boolean veld dat aangeeft of de gebruiker een lesgever is of niet.
        Standaard ingesteld op False.
        gepinde_vakken (ManyToManyField): Een veld dat verwijst naar het Vak model met een
        veel-op-veel-relatie, om de vakken die de gebruiker heeft gepind op te slaan.
        Dit veld is optioneel (mag leeg zijn).

    Methods:
        __str__(): Geeft een representatie van het model als een string terug,
        die de voornaam en achternaam van de gebruiker bevat.
    """

    user = models.OneToOneField(User, on_delete=models.CASCADE, primary_key=True)
    is_lesgever = models.BooleanField(default=False)
    gepinde_vakken = models.ManyToManyField(
        Vak, related_name="gebruiker_gepinde_vakken", blank=True
    )

    def __str__(self):
        return self.user.first_name + " " + self.user.last_name
