from rest_framework import serializers
from api.models.vak import Vak


class VakSerializer(serializers.ModelSerializer):
    class Meta:
        model = Vak
        fields = '__all__'

    def create(self, validated_data):
        """
        Creates a new vak to put in the database.

        Args:
            validated_data: Data about the vak.
        """
        students_data = validated_data.pop('studenten')
        teachers_data = validated_data.pop('lesgevers')

        validate_students_teachers(students_data, teachers_data)

        vak = Vak.objects.create(**validated_data)
        vak.studenten.set(students_data)
        vak.lesgevers.set(teachers_data)

        return vak

    def update(self, instance, validated_data):
        """
        Updates a vak in the database.

        Args:
            instance: Instance to be updated.
            validated_data: Data about the vak.
        """
        students_data = validated_data.pop('studenten', [])
        teachers_data = validated_data.pop('lesgevers', [])

        validate_students_teachers(students_data, teachers_data)

        super().update(instance=instance, validated_data=validated_data)
        instance.studenten.set(students_data)
        instance.lesgevers.set(teachers_data)

        instance.save()
        return instance

def validate_students_teachers(students_data, teachers_data):
    """
    Checks the validity of the data and raises an error if the data is invalid.
    The data is invalid when a teacher is considered a student of the course or vice versa.
    """
    for student in students_data:
        if student.is_lesgever:
            raise serializers.ValidationError("Alle gebruikers in 'studenten' moeten studenten zijn")

    for teacher in teachers_data:
        if not teacher.is_lesgever:
            raise serializers.ValidationError("Alle gebruikers in 'lesgevers' moeten lesgevers zijn")
