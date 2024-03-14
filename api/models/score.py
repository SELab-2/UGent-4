from django.db import models


class Score(models.Model):
    """
    Model voor het bijhouden van scores voor indieningen.

    Fields:
        score_id (AutoField): Een automatisch gegenereerd veld dat fungeert als de primaire sleutel voor de score.
        score (SmallIntegerField): Een veld om de scorewaarde op te slaan.
        indiening (ForeignKey): Een ForeignKey relatie met het 'Indiening' model, waarmee wordt aangegeven tot welke indiening deze score behoort. Als de bijbehorende indiening wordt verwijderd, wordt ook de bijbehorende score verwijderd.

    Methods:
        __str__(): Geeft een representatie van het model als een string terug, die de score-ID bevat.
    """
    score_id = models.AutoField(primary_key=True)
    score = models.SmallIntegerField()
    indiening = models.ForeignKey("Indiening", on_delete=models.CASCADE)

    def __str__(self):
        return str(self.score_id)
