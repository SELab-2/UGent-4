from django.db import models
from django.db.models.signals import m2m_changed
from django.dispatch import receiver
from api.models.gebruiker import Gebruiker


class Vak(models.Model):
    vak_id = models.AutoField(primary_key=True)
    name = models.CharField(max_length=100)
    students = models.ManyToManyField('Gebruiker', related_name='vak_gebruikers', blank=True)
    teachers = models.ManyToManyField('Gebruiker', related_name='vak_lesgevers', blank=True)
    projects = models.ManyToManyField('Project', related_name='vak_projecten', blank=True)

    def __str__(self):
        return self.name
    

@receiver(m2m_changed, sender=Vak.students.through)
@receiver(m2m_changed, sender=Vak.teachers.through)
def update_gebruiker_subjects(sender, instance, action, **kwargs):
    if action == 'post_add':
        for gebruiker_id in kwargs['pk_set']:
            gebruiker = Gebruiker.objects.get(pk=gebruiker_id)
            gebruiker.subjects.add(instance)
    if action == 'post_remove':
        for gebruiker_id in kwargs['pk_set']:
            gebruiker = Gebruiker.objects.get(pk=gebruiker_id)
            gebruiker.subjects.remove(instance)