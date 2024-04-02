from django.db import models


class Groep(models.Model):
    """
    Model voor een groep van studenten voor een project.

    Fields:
        groep_id (AutoField): Een automatisch gegenereerd veld dat fungeert als
        de primaire sleutel voor de groep.
        studenten (ManyToManyField): Een Many-to-Many relatie met het 'Gebruiker' model,
        waarmee meerdere gebruikers aan een groep kunnen worden gekoppeld.
        project (ForeignKey): Een ForeignKey relatie met het 'Project' model,
        waarmee wordt aangegeven tot welk project deze groep behoort.
        Als het bijbehorende project wordt verwijderd,
        worden ook de bijbehorende groepen verwijderd.

    Methods:
        __str__(): Geeft een representatie van het model als een string terug, die de groeps-ID bevat.
    """

    groep_id = models.AutoField(primary_key=True)
    studenten = models.ManyToManyField(
        "Gebruiker", related_name="groep_studenten", blank=True
    )
    project = models.ForeignKey("Project", on_delete=models.CASCADE)

    def __str__(self):
        return f"Group {self.groep_id}"
