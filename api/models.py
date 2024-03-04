from django.db import models
from django.contrib.auth.models import User


class Student(models.Model):
    user = models.OneToOneField(User, on_delete=models.CASCADE,primary_key=True,default=None)
    subjects = models.ManyToManyField('Vak', related_name='students_enrolled')

    def __str__(self):
        return self.user.first_name

class Lesgever(models.Model):
    lesgever_id = models.AutoField(primary_key=True)
    name = models.CharField(max_length=100)
    email = models.EmailField(default=False)
    subjects = models.ManyToManyField('Vak', related_name='lesgevers_enrolled', blank=True)
    is_admin = models.BooleanField(default=False)

    def __str__(self):
        return self.name

class Vak(models.Model):
    vak_id = models.AutoField(primary_key=True)
    name = models.CharField(max_length=100)
    students = models.ManyToManyField('Student', related_name='subjects_enrolled', blank=True)
    teachers = models.ManyToManyField('Lesgever', related_name='subjects_teachers')
    projects = models.ManyToManyField('Project', related_name='subjects_projects', blank=True)

    def __str__(self):
        return self.name
    
class Groep(models.Model):
    group_id = models.AutoField(primary_key=True)
    students = models.ManyToManyField('Student', related_name='groups_students', blank=True)
    project = models.ForeignKey('Project', on_delete=models.CASCADE)

    def __str__(self):
        return f"Group {self.group_id}"

class Project(models.Model):
    project_id = models.AutoField(primary_key=True)
    titel = models.CharField(max_length=100)
    description = models.TextField()
    opgavebestanden = models.FileField(upload_to='opgave/')
    vak = models.ForeignKey(Vak, on_delete=models.CASCADE)
    deadline = models.DateTimeField(null=True)
    # indiening restricties

    def __str__(self):
        return self.titel
    
class Indiening(models.Model):
    indiening_id = models.AutoField(primary_key=True)
    indiener = models.ForeignKey('Groep', on_delete=models.CASCADE)
    indieningsbestanden = models.FileField(upload_to='uploads/')
    tijdstip = models.DateTimeField(null=False)

    def __str__(self):
        return self.tijdstip
    
class Score(models.Model):
    score = models.SmallIntegerField()
    indiening = models.ForeignKey('Indiening', on_delete=models.CASCADE)
    groep = models.ForeignKey('Groep', on_delete=models.CASCADE)

    def __str__(self):
        return self.score
