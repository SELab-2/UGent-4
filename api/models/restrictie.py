from django.db import models
from api.models.project import Project


def upload_to(instance, filename):
    """
    Genereert het pad waar het opgavebestand wordt opgeslagen.

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
    Model voor het definiëren van restricties/tests voor projectinzendingen.

    Velden:
        restrictie_id (AutoField): Automatisch gegenereerd veld dat fungeert als primaire sleutel voor de restrictie.
        project (ForeignKey): Een ForeignKey relatie met het 'Project' model,
            waarmee wordt aangegeven welk project deze restrictie betreft.
        Als het bijbehorende project wordt verwijderd, worden ook de bijbehorende restricties verwijderd.
        script (FileField): Een veld voor het uploaden van het script van de restrictie/test.
        moet_slagen (BooleanField): Een veld om aan te geven of de inzending aan de restrictie/test moet voldoen.
            Standaard ingesteld op False.

    Methoden:
        __str__(): Geeft een representatie van het model als een string terug,
            die de titel van het bijbehorende project en de beschrijving van de restrictie bevat.
    """

    restrictie_id = models.AutoField(primary_key=True)
    project = models.ForeignKey(Project, on_delete=models.CASCADE)
    script = models.FileField(upload_to=upload_to)
    moet_slagen = models.BooleanField(default=False, blank=True)

    def __str__(self):
        return self.project.titel + ", restrictie: " + str(self.script)
