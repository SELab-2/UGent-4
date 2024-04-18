from django.db import models
from django.db.models.signals import post_save
from django.dispatch import receiver
from api.docker.python_entrypoint import run_tests_on
from threading import Thread
from django.db import transaction
import re


STATUS_CHOICES = (
    (-1, "FAIL"),
    (0, "PENDING"),
    (1, "OK"),
)


def upload_to(instance, filename):
    """
    Functie om het pad te genereren waar het bestand wordt opgeslagen.

    Args:
        instance: De huidige instantie van het model.
        filename (str): De oorspronkelijke bestandsnaam.

    Returns:
        str: Het pad waar het bestand moet worden opgeslagen.
    """
    return f"data/indieningen/indiening_{instance.indiening_id}/{filename}"


class Indiening(models.Model):
    """
    Model voor een indiening van een groep.

    Fields:
        indiening_id (AutoField): Een automatisch gegenereerd veld dat fungeert
        als de primaire sleutel voor de indiening.
        groep (ForeignKey): Een ForeignKey relatie met het 'Groep' model,
        waarmee wordt aangegeven tot welke groep deze indiening behoort.
        Als de bijbehorende groep wordt verwijderd, worden ook de bijbehorende
        indieningen verwijderd.
        tijdstip (DateTimeField): Een veld dat automatisch het tijdstip
        registreert waarop de indiening is aangemaakt.
        status (IntegerField): Een veld dat de status van de testen zal bijhouden.
        result (TextField): Een veld dat het resultaat van de uitgevoerde testen zal bijhouden.

    Methods:
        __str__(): Geeft een representatie van het model als een string terug, die de ID van de indiening bevat.
    """

    indiening_id = models.AutoField(primary_key=True)
    groep = models.ForeignKey("Groep", on_delete=models.CASCADE)
    tijdstip = models.DateTimeField(auto_now_add=True)
    status = models.IntegerField(default=0, choices=STATUS_CHOICES)
    result = models.TextField(default="", blank=True)

    def __str__(self):
        return str(self.indiening_id)


class IndieningBestand(models.Model):
    """
    Model voor een bestand dat aan een indiening is gekoppeld.

    Fields:
        indiening_bestand_id (AutoField): Een automatisch gegenereerd veld dat fungeert als
        de primaire sleutel voor het bestand.
        indiening (ForeignKey): Een ForeignKey relatie met het 'Indiening' model,
        waarmee wordt aangegeven tot welke indiening dit bestand behoort.
        Als de bijbehorende indiening wordt verwijderd,
        wordt ook het bijbehorende bestand verwijderd.
        bestand (FileField): Een veld voor het uploaden van het bestand.

    Methods:
        __str__(): Geeft een representatie van het model als een string terug, die de bestandsnaam bevat.
    """

    indiening_bestand_id = models.AutoField(primary_key=True)
    indiening = models.ForeignKey(
        Indiening, related_name="indiening_bestanden", on_delete=models.CASCADE
    )
    bestand = models.FileField(upload_to=upload_to)

    def __str__(self):
        return str(self.bestand.name)


def run_tests_async(instance):
    """
    Voert tests uit op een asynchrone manier en werkt de status en resultaat van de indiening bij.

    Args:
        instance: Het instantie-object van de indiening.
    """
    indiening_id = instance.indiening_id
    project_id = instance.groep.project.project_id
    result = run_tests_on(indiening_id, project_id)

    matches = re.findall(r"Testing \./.*", result[1])
    try:
        first_match_index = result[1].find(matches[0])
        result = result[1][first_match_index:]
        status = -1 if result[0] else 1
    except Exception:
        result = result[1]
        status = -1

    with transaction.atomic():
        instance.status = status
        instance.result = result
        instance.save()


@receiver(post_save, sender=Indiening)
def indiening_post_init(sender, instance, created, **kwargs):
    """
    Een signaalhandler die wordt geactiveerd na het maken van een nieuwe indiening.
    Start een asynchrone thread om de tests uit te voeren.

    Args:
        sender: De verzender van het signaal.
        instance: Het instantie-object van de indiening.
        created: Geeft aan of de indiening is aangemaakt of bijgewerkt.
        kwargs: Extra argumenten.
    """
    if created:
        thread = Thread(target=run_tests_async, args=(instance,))
        thread.start()
