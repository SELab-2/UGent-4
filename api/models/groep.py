from django.db import models


class Groep(models.Model):
    groep_id = models.AutoField(primary_key=True)
    studenten = models.ManyToManyField(
        "Gebruiker", related_name="groep_studenten", blank=True
    )
    project = models.ForeignKey("Project", on_delete=models.CASCADE)

    def __str__(self):
        return f"Group {self.groep_id}"
