from rest_framework import serializers
from api.models.groep import Groep


class GroepSerializer(serializers.ModelSerializer):
    class Meta:
        model = Groep
        fields = "__all__"

    def create(self, validated_data):
        students_data = validated_data.pop("studenten")
        validate_students(students_data, validated_data["project"])

        instance = Groep.objects.create(**validated_data)
        instance.studenten.set(students_data)

        return instance

    def update(self, instance, validated_data):
        students_data = validated_data.pop("studenten")
        validate_students(students_data, validated_data["project"])

        super().update(instance=instance, validated_data=validated_data)
        instance.studenten.set(students_data)
        instance.save()

        return instance


def validate_students(students_data, project):
    groepen = Groep.objects.filter(project=project)

    for student in students_data:
        if student.is_lesgever:
            raise serializers.ValidationError(
                "Alle gebruikers in 'studenten' moeten studenten zijn!"
            )

        for groep in groepen:
            if groep.studenten.contains(student):
                raise serializers.ValidationError(
                    f"Gebruiker {student.user.id} zit al in een groep voor dit project"
                )
