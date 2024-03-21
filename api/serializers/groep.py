from rest_framework import serializers
from api.models.groep import Groep


class GroepSerializer(serializers.ModelSerializer):
    """
    Serializer voor het serialiseren en deserialiseren van Groep objecten.

    Fields:
        Meta.model (Groep): Het model waarop de serializer is gebaseerd.
        Meta.fields (tuple): De velden die moeten worden opgenomen in de serializer.
        Hier wordt '__all__' gebruikt om alle velden op te nemen.

    Methods:
        create(self, validated_data): Maakt een nieuwe groep
        aan en voegt deze toe aan de database.
        update(self, instance, validated_data): Werkt een bestaande groep bij
        in de database.
    """

    class Meta:
        model = Groep
        fields = "__all__"

    def create(self, validated_data):
        """
        Args:
            validated_data (dict): Gevalideerde gegevens over de groep.

        Returns:
            Groep: De aangemaakte groep.
        """
        students_data = validated_data.pop("studenten")
        validate_students(students_data, validated_data["project"])
        instance = Groep.objects.create(**validated_data)
        instance.studenten.set(students_data)

        return instance

    def update(self, instance, validated_data):
        """
        Args:
            instance (Groep): De groep die moet worden bijgewerkt.
            validated_data (dict): Gevalideerde gegevens over de groep.

        Returns:
            Groep: De bijgewerkte groep.
        """
        students_data = validated_data.pop("studenten")
        validate_students(
            students_data, validated_data["project"], current_group=instance
        )
        super().update(instance=instance, validated_data=validated_data)
        instance.studenten.set(students_data)
        instance.save()

        return instance


def validate_students(students_data, project, current_group=None):
    """
    Controleert of de opgegeven gebruikers studenten zijn en of ze al in een andere groep voor dit project zitten.

    Args:
        students_data (list): Een lijst met gebruikers die aan de groep moeten worden toegevoegd.
        project (Project): Het project waartoe de groep behoort.
        current_groep (Groep): De huidige groep waartoe de studenten behoren.


    Raises:
        serializers.ValidationError: Als een gebruiker geen student is of al in een andere groep voor dit project zit.
    """
    groepen = Groep.objects.filter(project=project)


    for student in students_data:
        if student.is_lesgever:
            raise serializers.ValidationError(
                "Alle gebruikers in 'studenten' moeten studenten zijn!"
            )
        
        if not project.vak.studenten.all().contains(student):
            raise serializers.ValidationError(
                f"Student {student} is geen student van het vak {project.vak}"
            )

        for groep in groepen:
            if (
                current_group
                and groep.groep_id != current_group.groep_id
                and student in groep.studenten.all()
            ):
                raise serializers.ValidationError(
                    f"Student {student} zit al in een andere groep voor dit project!"
                )
