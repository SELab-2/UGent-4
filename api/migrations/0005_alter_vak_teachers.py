# Generated by Django 5.0.2 on 2024-02-27 19:50

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('api', '0004_alter_student_subjects'),
    ]

    operations = [
        migrations.AlterField(
            model_name='vak',
            name='teachers',
            field=models.ManyToManyField(blank=True, related_name='subjects_teachers', to='api.lesgever'),
        ),
    ]
