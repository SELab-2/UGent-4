from rest_framework import serializers
from api.models.gebruiker import Gebruiker


class GebruikerSerializer(serializers.ModelSerializer):
    class Meta:
        model = Gebruiker
        fields = "__all__"

    def create(self, validated_data):
        subjects_data = validated_data.pop("subjects")
        instance = Gebruiker.objects.create(**validated_data)
        instance.subjects.set(subjects_data)

        populate_subject_gebruikers(instance)

        return instance

    def update(self, instance, validated_data):
        instance.is_lesgever = validated_data.pop("is_lesgever", False)

        subjects_data = validated_data.pop("subjects", [])

        depopulate_subject_gebruikers(instance)

        instance.subjects.clear()
        instance.subjects.set(subjects_data)

        populate_subject_gebruikers(instance)

        instance.save()
        return instance


def populate_subject_gebruikers(gebruiker):
    for subject in gebruiker.subjects.all():
        if gebruiker.is_lesgever:
            subject.teachers.add(gebruiker)
        else:
            subject.students.add(gebruiker)


def depopulate_subject_gebruikers(gebruiker):
    for subject in gebruiker.subjects.all():
        subject.students.remove(gebruiker)
        subject.teachers.remove(gebruiker)
