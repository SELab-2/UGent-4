from rest_framework import serializers
from api.models.groep import Groep
from collections import Counter


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
        project = validated_data["project"]
        validate_students(students_data, project)
        validate_groep_grootte(students_data, project)
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
        students_data = validated_data.pop("studenten", instance.studenten)
        new_project = validated_data.get("project", instance.project)
        validate_students(students_data, new_project, current_group=instance)
        validate_project(instance, new_project)
        validate_groep_grootte(students_data, new_project)

        super().update(instance=instance, validated_data=validated_data)
        instance.studenten.set(students_data)
        instance.save()

        return instance


def validate_project(instance, new_project):
    """
    Valideert of het project van een groep niet kan worden aangepast.

    Args:
        instance: De huidige instantie van het project.
        new_project: Het nieuwe project waaraan de groep wil worden gekoppeld.

    Raises:
        serializers.ValidationError: Wordt opgegooid als het project van een groep wordt aangepast.
    """

    if instance.project != new_project:
        raise serializers.ValidationError(
            "Het project van een groep kan niet aangepast worden"
        )


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
    if current_group is not None:
        groepen = groepen.exclude(groep_id=current_group.groep_id)

    student_counts = Counter(students_data)
    for student, count in student_counts.items():
        if count > 1:
            raise serializers.ValidationError(
                f"Student {student} komt meerdere keren voor in de groep!"
            )

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
            if student in groep.studenten.all():
                raise serializers.ValidationError(
                    f"Student {student} zit al in een andere groep voor dit project!"
                )


def validate_groep_grootte(studenten, project):
    if len(studenten) > project.max_groep_grootte:
        raise serializers.ValidationError(
            f"Dit project heeft een maximum groep grootte van {project.max_groep_grootte} studenten"
        )
