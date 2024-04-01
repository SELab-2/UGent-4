from django.db import models
from .vak import Vak


def upload_to(instance, filename):
    """
    Functie om het pad te genereren waar het opgavebestand wordt opgeslagen.

    Args:
        instance: De huidige instantie van het model.
        filename (str): De oorspronkelijke bestandsnaam.

    Returns:
        str: Het pad waar het opgavebestand moet worden opgeslagen.
    """
    vak_id = instance.vak.vak_id
    return f"data/opgaves/vak_{vak_id}/{filename}"


class Project(models.Model):
    """
    Model voor een project binnen een vak.

    Velden:
        project_id (AutoField): Een automatisch gegenereerd veld dat fungeert als de primaire sleutel voor het project.
        titel (CharField): Titel van het project.
        beschrijving (TextField): Beschrijving van het project.
        opgave_bestand (FileField): Een veld voor het uploaden van het opgavebestand voor het project.
        (eventueel uit te breiden tot meerdere bestanden mogelijk)
        vak (ForeignKey): Een ForeignKey relatie met het 'Vak' model,
        waarmee wordt aangegeven tot welk vak dit project behoort.
        Als het bijbehorende vak wordt verwijderd, worden ook de bijbehorende projecten verwijderd.
        deadline (DateTimeField): Een veld voor het instellen van de deadline voor het project.
        Kan optioneel zijn (null=True).
        extra_deadline (DateTimeField): Een extra veld voor het instellen van een extra deadline voor het project.
        Kan optioneel zijn (null=True).
        max_score (IntegerField): Een veld voor het instellen van de maximale score voor het project.
        Standaard ingesteld op 20.
        max_groep_grootte (IntegerField): Een veld voor het instellen van de max grootte van de groep voor het project.
        Standaard ingesteld op 1.
        zichtbaar (BooleanField): Een veld om aan te geven of het project zichtbaar is of niet.
        Standaard ingesteld op True.
        gearchiveerd (BooleanField): Een veld om aan te geven of het project gearchiveerd is of niet.
        Standaard ingesteld op False.

    Methoden:
        __str__(): Geeft een representatie van het model als een string terug,
        die de titel van het project bevat.
    """

    project_id = models.AutoField(primary_key=True)
    titel = models.CharField(max_length=100)
    beschrijving = models.TextField()
    opgave_bestand = models.FileField(upload_to=upload_to)
    vak = models.ForeignKey(Vak, on_delete=models.CASCADE)
    deadline = models.DateTimeField(null=True, blank=True)
    extra_deadline = models.DateTimeField(null=True, blank=True, default=None)
    max_score = models.IntegerField(default=20)
    max_groep_grootte = models.IntegerField(default=1)
    zichtbaar = models.BooleanField(default=True, blank=True)
    gearchiveerd = models.BooleanField(default=False, blank=True)

    def __str__(self):
        return self.titel
