from django.db import models


class Lesgever(models.Model):
    lesgever_id = models.AutoField(primary_key=True)
    name = models.CharField(max_length=100)
    email = models.EmailField()
    subjects = models.ManyToManyField('Vak', related_name='lesgevers_enrolled', blank=True)
    is_admin = models.BooleanField(default=False)

    def __str__(self):
        return self.name