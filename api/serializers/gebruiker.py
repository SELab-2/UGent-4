from rest_framework import serializers
from api.models.gebruiker import Gebruiker


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
            instance.subjects.clear()
            for subject_data in subjects_data:
                instance.subjects.add(subject_data)

        instance.save()
        return instance
