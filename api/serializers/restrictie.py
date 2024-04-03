from rest_framework import serializers
from api.models.restrictie import Restrictie


class RestrictieSerializer(serializers.ModelSerializer):
    """
    Serializer voor het serialiseren en deserialiseren van Restrictie objecten.

    Meta:
        model (Restrictie): Het model waarop de serializer is gebaseerd.
        fields (str): De velden die moeten worden opgenomen in de serializer.
            Hier wordt '__all__' gebruikt om alle velden op te nemen.

    Methods:
        create(self, validated_data): Maakt een nieuwe restrictie aan en voegt deze toe aan de database.
        update(self, instance, validated_data): Werkt een bestaande restrictie bij in de database.
    """

    class Meta:
        model = Restrictie
        fields = "__all__"

    def create(self, validated_data):
        """
        Maakt een nieuwe restrictie aan en voegt deze toe aan de database.

        Args:
            validated_data (dict): Gevalideerde gegevens over de restrictie.

        Returns:
            Restrictie: De aangemaakte restrictie.
        """
        validate_script(validated_data.get("script"))
        return Restrictie.objects.create(**validated_data)

    def update(self, instance, validated_data):
        """
        Werkt een bestaande restrictie bij in de database.

        Args:
            instance (Restrictie): De restrictie die moet worden bijgewerkt.
            validated_data (dict): Gevalideerde gegevens over de restrictie.

        Returns:
            Restrictie: De bijgewerkte restrictie.
        """
        validate_project(instance, validated_data.get("project"))
        validate_script(validated_data.get("script"))

        super().update(instance=instance, validated_data=validated_data)
        instance.save()
        return instance


def validate_script(new_script):
    """
    Controleert of het opgegeven script een geldig Python- of Shell-script is.

    Args:
        new_script: Het nieuwe script dat moet worden gevalideerd.

    Raises:
        serializers.ValidationError: Als het script geen Python- of Shell-script is.
    """
    if not (str(new_script).endswith(".sh") or str(new_script).endswith(".py")):
        raise serializers.ValidationError(
            "Het restrictie script moet een Python of Shell script zijn"
        )


def validate_project(instance, new_project):
    """
    Valideert of het project van een restrictie niet kan worden aangepast.

    Args:
        instance: De huidige instantie van de restrictie.
        new_project: Het nieuwe project waaraan de restrictie moet worden gekoppeld.

    Raises:
        serializers.ValidationError: Wordt opgegooid als het project van een restrictie wordt aangepast.
    """
    if instance.project != new_project:
        raise serializers.ValidationError(
            "Het project van een restrictie kan niet aangepast worden"
        )
