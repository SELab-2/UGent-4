from django.db import models
from django.contrib.auth.models import User


class Gebruiker(models.Model):
    user = models.OneToOneField(User, on_delete=models.CASCADE, primary_key=True)
    is_lesgever = models.BooleanField(default=False)

    def __str__(self):
        return self.user.first_name + " " + self.user.last_name
