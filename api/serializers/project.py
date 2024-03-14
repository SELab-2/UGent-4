from rest_framework import serializers
from api.models.project import Project
from django.utils import timezone


class ProjectSerializer(serializers.ModelSerializer):
    """
    Serializer voor het serialiseren en deserialiseren van Project objecten.

    Fields:
        Meta.model (Project): Het model waarop de serializer is gebaseerd.
        Meta.fields (tuple): De velden die moeten worden opgenomen in de serializer.
        Hier wordt '__all__' gebruikt om alle velden op te nemen.

    Methods:
        create(self, validated_data): Maakt een nieuw project aan en voegt deze toe aan de database.
        update(self, instance, validated_data): Werkt een bestaand project bij in de database.
    """

    class Meta:
        model = Project
        fields = "__all__"

    def create(self, validated_data):
        """
        Args:
            validated_data (dict): Gevalideerde gegevens over het project.

        Returns:
            Project: Het aangemaakte project.
        """
        deadline = validated_data.pop("deadline")
        validate_deadline(deadline)

        project = Project.objects.create(**validated_data)
        project.deadline = deadline
        project.save()
        return project

    def update(self, instance, validated_data):
        """
        Args:
            instance (Project): Het project dat moet worden bijgewerkt.
            validated_data (dict): Gevalideerde gegevens over het project.

        Returns:
            Project: Het bijgewerkte project.
        """
        deadline = validated_data.pop("deadline")
        validate_deadline(deadline)

        super().update(instance=instance, validated_data=validated_data)
        instance.deadline = deadline
        instance.save()
        return instance


def validate_deadline(deadline):
    """
    Controleert of de opgegeven deadline in de toekomst ligt.

    Args:
        deadline (datetime): De deadline van het project.

    Raises:
        serializers.ValidationError: Als de deadline in het verleden ligt.
    """
    if deadline <= timezone.now():
        raise serializers.ValidationError("Deadline moet in de toekomst liggen")
