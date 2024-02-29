from django.db import models
from django.contrib.auth.models import User


class Student(models.Model):
    user = models.OneToOneField(User, on_delete=models.CASCADE,primary_key=True,default=None)
    subjects = models.ManyToManyField('Vak', related_name='students_enrolled')

    def __str__(self):
        return self.user.first_name
