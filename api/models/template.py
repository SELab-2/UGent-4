from django.db import models
from django.contrib.auth.models import User


def upload_to(instance, filename):
    """
    Functie om het pad te genereren waar het bestand wordt opgeslagen.

    Args:
        instance: De huidige instantie van het model.
        filename (str): De oorspronkelijke bestandsnaam.

    Returns:
        str: Het pad waar het bestand moet worden opgeslagen.
    """
    return f"data/templates/gebruiker_{instance.user.id}/{filename}"


class Template(models.Model):

    template_id = models.AutoField(primary_key=True)
    user = models.ForeignKey(
        User, related_name="template_user", on_delete=models.CASCADE
    )
    bestand = models.FileField(upload_to=upload_to)

    def __str__(self):
        return str(self.bestand.name)
