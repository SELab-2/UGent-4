from django.db import models

    
class Indiening(models.Model):
    indiening_id = models.AutoField(primary_key=True)
    indiener = models.ForeignKey('Groep', on_delete=models.CASCADE)
    indieningsbestanden = models.FileField(upload_to='uploads/')
    tijdstip = models.DateTimeField(null=False)
    project = models.ForeignKey('Project', on_delete=models.CASCADE, default='0')

    def __str__(self):
        return self.tijdstip
    