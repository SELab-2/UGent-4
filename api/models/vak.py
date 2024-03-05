from django.db import models


class Vak(models.Model):
    vak_id = models.AutoField(primary_key=True)
    name = models.CharField(max_length=100)
    students = models.ManyToManyField('Gebruiker', related_name='vak_gebruikers', blank=True)
    teachers = models.ManyToManyField('Gebruiker', related_name='vak_lesgevers')
    projects = models.ManyToManyField('Project', related_name='vak_projecten', blank=True)

    def __str__(self):
        return self.name
