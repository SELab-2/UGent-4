from django.db.models.signals import m2m_changed
from django.dispatch import receiver
from api.models.gebruiker import Gebruiker
from api.models.vak import Vak

@receiver(m2m_changed, sender=Gebruiker.subjects.through)
def update_gebruiker_subjects(sender, instance, action, **kwargs):
    print('piemel')
    if action == 'post_add':
        print('hallo')
        for vak_id in kwargs['pk_set']:
            vak = Vak.objects.get(pk=vak_id)
            vak.students.add(instance)
    if action == 'post_remove':
        for vak_id in kwargs['pk_set']:
            vak = Vak.objects.get(pk=vak_id)
            vak.students.remove(instance)


@receiver(m2m_changed, sender=Vak.students.through)
@receiver(m2m_changed, sender=Vak.teachers.through)
def update_subject_teachers_students(sender, instance, action, **kwargs):
    if action == 'post_add':
        for gebruiker_id in kwargs['pk_set']:
            gebruiker = Gebruiker.objects.get(pk=gebruiker_id)
            gebruiker.subjects.add(instance)
    if action == 'post_remove':
        for gebruiker_id in kwargs['pk_set']:
            gebruiker = Gebruiker.objects.get(pk=gebruiker_id)
            gebruiker.subjects.remove(instance)