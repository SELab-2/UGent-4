from rest_framework import serializers
from api.models.project import Project
from django.utils import timezone
from api.serializers.restrictie import RestrictieSerializer
from api.serializers.groep import GroepSerializer


class ProjectSerializer(serializers.ModelSerializer):
    """
    Serializer voor het serialiseren en deserialiseren van Project objecten.

    Fields:
        restricties (RestrictieSerializer): Serializer voor het serialiseren van restricties.
            Veelvoudig, alleen-lezen veld.

    Meta:
        model (Project): Het model waarop de serializer is gebaseerd.
        fields (list): De velden die moeten worden opgenomen in de serializer.

    Methods:
        create(self, validated_data): Maakt een nieuw project aan en voegt deze toe aan de database.
        update(self, instance, validated_data): Werkt een bestaand project bij in de database.
    """

    restricties = RestrictieSerializer(many=True, read_only=True)

    class Meta:
        model = Project
        fields = [
            "project_id",
            "titel",
            "beschrijving",
            "opgave_bestand",
            "vak",
            "deadline",
            "extra_deadline",
            "max_score",
            "max_groep_grootte",
            "student_groep",
            "zichtbaar",
            "gearchiveerd",
            "restricties",
        ]

    def create(self, validated_data):
        """
        Creëert een nieuw project en voegt deze toe aan de database.

        Args:
            validated_data (dict): Gevalideerde gegevens over het project.

        Returns:
            Project: Het aangemaakte project.
        """
        deadline = validated_data.pop("deadline", None)
        extra_deadline = validated_data.pop("extra_deadline", None)
        validate_deadlines(deadline, extra_deadline)

        project = Project.objects.create(**validated_data)
        project.deadline = deadline
        project.extra_deadline = extra_deadline
        project.save()
        create_groepen(project)
        return project

    def update(self, instance, validated_data):
        """
        Werkt een bestaand project bij in de database.

        Args:
            instance (Project): Het project dat moet worden bijgewerkt.
            validated_data (dict): Gevalideerde gegevens over het project.

        Returns:
            Project: Het bijgewerkte project.
        """
        validated_data.pop("max_groep_grootte")
        validated_data.pop("project_groep")

        deadline = validated_data.pop("deadline", instance.deadline)
        extra_deadline = validated_data.pop("extra_deadline", instance.extra_deadline)
        validate_deadlines(deadline, extra_deadline)

        new_vak = validated_data.get("vak", instance.vak)
        validate_vak(instance, new_vak)

        super().update(instance=instance, validated_data=validated_data)
        instance.deadline = deadline
        instance.extra_deadline = extra_deadline
        instance.save()
        return instance


def create_groepen(instance):
    if instance.max_groep_grootte == 1 or instance.student_groep:
        for student in instance.vak.studenten.all():
            try:
                serializer = GroepSerializer(
                    data={"studenten": [student], "project": instance.project_id}
                )
                if serializer.is_valid():
                    serializer.save()
            except Exception:
                pass
    else:
        for _ in range(len(instance.vak.studenten.all())//instance.max_groep_grootte + 1):
            try:
                serializer = GroepSerializer(
                    data={"studenten": [], "project": instance.project_id}
                )
                if serializer.is_valid():
                    serializer.save()
            except Exception:
                pass


def validate_deadlines(deadline, extra_deadline):
    """
    Controleert of de opgegeven deadline in de toekomst ligt.

    Args:
        deadline (datetime): De deadline van het project.

    Raises:
        serializers.ValidationError: Als de deadline in het verleden ligt.
    """

    if not deadline:
        return
    if deadline <= timezone.now():
        raise serializers.ValidationError("Deadline moet in de toekomst liggen")

    if extra_deadline and extra_deadline <= deadline:
        raise serializers.ValidationError(
            "Extra deadline moet na de eerste deadline liggen"
        )


def validate_vak(instance, new_vak):
    """
    Valideert of het vak van een project niet kan worden aangepast.

    Parameters:
        instance: De huidige instantie van het project.
        new_vak: Het nieuwe vak waaraan het project moet worden gekoppeld.

    Raises:
        serializers.ValidationError: Wordt opgegooid als het vak van een project wordt aangepast.
    """

    if instance.vak != new_vak:
        raise serializers.ValidationError(
            "Het vak van een project kan niet aangepast worden"
        )
