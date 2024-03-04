from django.db import models


class Groep(models.Model):
    group_id = models.AutoField(primary_key=True)
    students = models.ManyToManyField('Student', related_name='groups_students', blank=True)
    project = models.ForeignKey('Project', on_delete=models.CASCADE)

    def __str__(self):
        return f"Group {self.group_id}"
