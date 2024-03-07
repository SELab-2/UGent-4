from rest_framework import serializers
from api.models.gebruiker import Gebruiker
from api.utils import clear


class GebruikerSerializer(serializers.ModelSerializer):
    class Meta:
        model = Gebruiker
        fields = '__all__'

    def create(self, validated_data):
        subjects_data = validated_data.pop('subjects')
        student = Gebruiker.objects.create(**validated_data)
        student.subjects.set(subjects_data)
        return student

    def update(self, instance, validated_data):
        subjects_data = validated_data.pop('subjects', None)
        if subjects_data is not None:
            clear(instance.subjects)
            instance.subjects.set(subjects_data)

        instance.save()
        return instance
