from django.db import models
from django.core.exceptions import ValidationError


class Vak(models.Model):
    vak_id = models.AutoField(primary_key=True)
    name = models.CharField(max_length=100)
    students = models.ManyToManyField('Gebruiker', related_name='vak_gebruikers', blank=True)
    teachers = models.ManyToManyField('Gebruiker', related_name='vak_lesgevers', blank=True)
    projects = models.ManyToManyField('Project', related_name='vak_projecten', blank=True)

    def __str__(self):
        return self.name
    
    def save(self, *args, **kwargs):
        if self.teachers.filter(is_lesgever=False).exists():
            raise ValidationError("Niet alle gebruikers in 'teachers' zijn lesgevers.")

        if self.students.filter(is_lesgever=True).exists():
            raise ValidationError("Niet alle gebruikers in 'students' zijn studenten.")

        super(Vak, self).save(*args, **kwargs)
