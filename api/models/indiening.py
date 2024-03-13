from django.db import models


def upload_to(instance, filename):
    return f"data/indieningen/indiening_{instance.indiening_id}/{filename}"


class Indiening(models.Model):
    indiening_id = models.AutoField(primary_key=True)
    groep = models.ForeignKey("Groep", on_delete=models.CASCADE)
    tijdstip = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return str(self.indiening_id)


class IndieningBestand(models.Model):
    indiening_bestand_id = models.AutoField(primary_key=True)
    indiening = models.ForeignKey("Indiening", on_delete=models.CASCADE)
    bestand = models.FileField(upload_to=upload_to)

    def __str__(self):
        return str(self.bestand.name)
