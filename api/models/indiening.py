from django.db import models
from django.db.models.signals import post_save
from django.dispatch import receiver
from api.docker.python_entrypoint import run_tests_on
from threading import Thread
from django.db import transaction
from django.core.files.storage import default_storage
from django.core.files.base import ContentFile

from api.models.restrictie import Restrictie
from api.utils import send_indiening_confirmation_mail


STATUS_CHOICES = (
    (-1, "FAIL"),
    (0, "PENDING"),
    (1, "OK"),
)


def upload_to(instance, filename):
    """
    Genereert het pad waar het bestand wordt opgeslagen.

    Args:
        instance: De huidige instantie van het model.
        filename (str): De oorspronkelijke bestandsnaam.

    Returns:
        str: Het pad waar het bestand moet worden opgeslagen.
    """
    # Use a placeholder for the initial save
    if instance.indiening_id is None:
        return f"data/indieningen/temp/{filename}"
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
        bestand (FileField): Een veld voor het uploaden van het bestand,
        met een dynamisch gegenereerd pad.
        status (IntegerField): Een veld dat de status van de testen zal bijhouden.
        result (TextField): Een veld dat het resultaat van de uitgevoerde testen zal bijhouden.
        artefacten (FileField): Een optioneel veld voor het uploaden van extra artefacten.

    Methods:
        __str__(): Geeft een representatie van het model als een string terug,
        die de ID van de indiening bevat.
        save(*args, **kwargs): Overschrijft de standaard opslaanmethode om het pad van het bestand bij te werken.
    """

    indiening_id = models.AutoField(primary_key=True)
    groep = models.ForeignKey("Groep", on_delete=models.CASCADE)
    tijdstip = models.DateTimeField(auto_now_add=True)
    bestand = models.FileField(upload_to=upload_to)
    status = models.IntegerField(default=0, choices=STATUS_CHOICES)
    result = models.TextField(default="", blank=True)
    artefacten = models.FileField(blank=True)

    def __str__(self):
        return str(self.indiening_id)

    def save(self, *args, **kwargs):
        if "temp" not in self.bestand.name:
            super(Indiening, self).save(*args, **kwargs)

        if "temp" in self.bestand.name:
            old_file = self.bestand
            old_file_name = old_file.name
            new_path = old_file.name.replace(
                "temp", f"indiening_{self.indiening_id}"
            )
            default_storage.save(new_path, ContentFile(old_file.read()))
            self.bestand.name = new_path
            super(Indiening, self).save(*args, **kwargs)
            default_storage.delete(old_file_name)
        else:
            super(Indiening, self).save(*args, **kwargs)

        
def run_tests_async(instance):
    """
    Voert tests uit op een asynchrone manier en werkt de status en het resultaat van de indiening bij.

    Args:
        instance: Het instantie-object van de indiening.
    """
    indiening_id = instance.indiening_id
    project_id = instance.groep.project.project_id
    result = run_tests_on(indiening_id, project_id)
    with transaction.atomic():
        instance.status = -1 if "FAIL" in result else 1
        instance.result = result
        instance.artefacten = (
            f"data/indieningen/indiening_{indiening_id}/artefacten.zip"
        )
        instance.save()
    send_indiening_confirmation_mail(instance)


@receiver(post_save, sender=Indiening)
def indiening_post_init(sender, instance, created, **kwargs):
    """
    Een signaalhandler die wordt geactiveerd na het maken van een nieuwe indiening.
    Start een asynchrone thread om de tests uit te voeren of werkt de status bij indien er geen restricties zijn.

    Args:
        sender: De verzender van het signaal.
        instance: Het instantie-object van de indiening.
        created: Geeft aan of de indiening is aangemaakt of bijgewerkt.
        kwargs: Extra argumenten.
    """
    if created:
        restricties = Restrictie.objects.filter(project=instance.groep.project)
        if len(restricties) == 0:
            with transaction.atomic():
                instance.status = 1
                instance.result = "No tests: OK"
                instance.save()
            send_indiening_confirmation_mail(instance)
        else:
            thread = Thread(target=run_tests_async, args=(instance,))
            thread.start()
