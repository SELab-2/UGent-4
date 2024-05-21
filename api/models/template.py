from django.db import models
from django.contrib.auth.models import User


def upload_to(instance, filename):
    """
    Genereert het pad waar het bestand wordt opgeslagen.

    Args:
        instance: De huidige instantie van het model.
        filename (str): De oorspronkelijke bestandsnaam.

    Returns:
        str: Het pad waar het bestand moet worden opgeslagen.
    """
    return f"data/templates/gebruiker_{instance.user.id}/{filename}"


class Template(models.Model):
    """
    Model voor het bijhouden van templates geüpload door gebruikers.

    Velden:
        template_id (AutoField): Een automatisch gegenereerd veld dat fungeert als de primaire sleutel
            voor de template.
        user (ForeignKey): Een ForeignKey relatie met het 'User' model,
            waarmee wordt aangegeven welke gebruiker de template heeft geüpload.
        bestand (FileField): Een veld voor het uploaden van de template,
            met een dynamisch gegenereerd pad.

    Methoden:
        __str__(): Geeft een representatie van het model als een string terug,
            die de bestandsnaam van de template bevat.
    """

    template_id = models.AutoField(primary_key=True)
    user = models.ForeignKey(
        User, related_name="template_user", on_delete=models.CASCADE
    )
    bestand = models.FileField(upload_to=upload_to)

    def __str__(self):
        return str(self.bestand.name)
