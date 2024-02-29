from django.db import models


class Vak(models.Model):
    vak_id = models.AutoField(primary_key=True)
    name = models.CharField(max_length=100)
    students = models.ManyToManyField('Student', related_name='subjects_enrolled', blank=True)
    teachers = models.ManyToManyField('Lesgever', related_name='subjects_teachers')
    projects = models.ManyToManyField('Project', related_name='subjects_projects', blank=True)

    def __str__(self):
        return self.name
