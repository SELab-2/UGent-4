from django.db import models
from api.models.project import Project


def upload_to(instance, filename):
    """
    Functie om het pad te genereren waar het opgavebestand wordt opgeslagen.

    Args:
        instance: De huidige instantie van het model.
        filename (str): De oorspronkelijke bestandsnaam.

    Returns:
        str: Het pad waar het opgavebestand moet worden opgeslagen.
    """
    project_id = instance.project.project_id
    return f"data/restricties/project_{project_id}/{filename}"


class Restrictie(models.Model):
    """
    TODO
    """

    restrictie_id = models.AutoField(primary_key=True)
    project = models.ForeignKey(Project, on_delete=models.CASCADE)
    script = models.FileField(upload_to=upload_to)
    moet_slagen = models.BooleanField(default=False, blank=True)

    def __str__(self):
        return self.project.titel + ", restrictie: " + str(self.script)
