from django.db import models


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

    Methods:
        __str__(): Geeft een representatie van het model als een string terug, die de ID van de indiening bevat.
    """

    indiening_id = models.AutoField(primary_key=True)
    groep = models.ForeignKey("Groep", on_delete=models.CASCADE)
    tijdstip = models.DateTimeField(auto_now_add=True)
    status = models.BooleanField()

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
    indiening = models.ForeignKey(Indiening, related_name='indiening_bestanden', on_delete=models.CASCADE)
    bestand = models.FileField(upload_to=upload_to)

    def __str__(self):
        return str(self.bestand.name)
