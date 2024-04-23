from django.db import models
from datetime import date


class Vak(models.Model):
    """
    Model voor een vak.

    Fields:
        vak_id (AutoField): Een automatisch gegenereerd veld dat fungeert als de primaire sleutel voor het vak.
        naam (CharField): Een veld om de naam van het vak op te slaan.
        jaartal (IntegerField): Een veld om het jaartal van het vak op te slaan. (voor 2024-2025 zou je 2025 opslaan)
        gearchiveerd (BooleanField): Een veld om aan te geven als het vak gearchiveerd is.
        studenten (ManyToManyField): Een Many-to-Many relatie met het 'Gebruiker' model,
        waarmee meerdere gebruikers aan het vak kunnen worden gekoppeld als studenten.
        lesgevers (ManyToManyField): Een Many-to-Many relatie met het 'Gebruiker' model,
        waarmee meerdere gebruikers aan het vak kunnen worden gekoppeld als lesgevers.
        invited (ManyToManyField): Een Many-To-Many relatie met het 'Gebruiker' model,
        waarmee meerdere gebruikers aan het vak kunenn worden gekoppeld als geinviteerde.

    Methods:
        __str__(): Geeft een representatie van het model als een string terug, die de naam van het vak bevat.
    """

    vak_id = models.AutoField(primary_key=True)
    naam = models.CharField(max_length=100)
    jaartal = models.IntegerField(default=date.today().year)
    gearchiveerd = models.BooleanField(default=False, blank=True)
    studenten = models.ManyToManyField(
        "Gebruiker", related_name="vak_gebruikers", blank=True
    )
    lesgevers = models.ManyToManyField(
        "Gebruiker", related_name="vak_lesgevers", blank=True
    )

    def __str__(self):
        return self.naam
