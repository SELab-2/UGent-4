from rest_framework import serializers
from api.models.gebruiker import Gebruiker
from api.models.vak import Vak


class GebruikerSerializer(serializers.ModelSerializer):
    """
    Serializer voor het serialiseren en deserialiseren van Gebruiker objecten.

    Velden:
        Meta.model (Gebruiker): Het model waarop de serializer is gebaseerd.
        Meta.fields (list): De velden die moeten worden opgenomen in de serializer.
        Hier wordt '__all__' gebruikt om alle velden op te nemen.

    Methoden:
        create(self, validated_data): Maakt een nieuwe gebruiker aan en voegt deze toe aan de database.
        update(self, instance, validated_data): Werkt een bestaande gebruiker bij in de database.
    """

    first_name = serializers.CharField(source="user.first_name", read_only=True)
    last_name = serializers.CharField(source="user.last_name", read_only=True)
    email = serializers.EmailField(source="user.email", read_only=True)

    class Meta:
        model = Gebruiker
        fields = [
            "user",
            "is_lesgever",
            "first_name",
            "last_name",
            "email",
            "gepinde_vakken",
        ]

    def create(self, validated_data):
        """
        Maakt een nieuwe gebruiker aan.

        Args:
            validated_data (dict): Gevalideerde gegevens over de gebruiker.

        Returns:
            Gebruiker: De aangemaakte gebruiker.
        """

        gepinde_vakken = validated_data.pop("gepinde_vakken", [])
        instance = Gebruiker.objects.create(**validated_data)
        validate_gepinde_vakken(instance, gepinde_vakken)
        instance.gepinde_vakken.set(gepinde_vakken)

        return instance

    def update(self, instance, validated_data):
        """
        Werkt een bestaande gebruiker bij.

        Args:
            instance (Gebruiker): De gebruiker die moet worden bijgewerkt.
            validated_data (dict): Gevalideerde gegevens over de gebruiker.

        Returns:
            Gebruiker: De bijgewerkte gebruiker.
        """

        validated_data.pop("user", None)
        validated_data.pop("is_lesgever", None)

        gepinde_vakken = validated_data.pop(
            "gepinde_vakken", instance.gepinde_vakken.all()
        )
        validate_gepinde_vakken(instance, gepinde_vakken)
        instance.gepinde_vakken.set(gepinde_vakken)

        instance.save()
        return instance


def validate_gepinde_vakken(instance, gepinde_vakken):
    """
    Valideert of de gepinde vakken geldig zijn voor de gebruiker.

    Args:
        instance (Gebruiker): De gebruiker voor wie de gepinde vakken worden gecontroleerd.
        gepinde_vakken (list): Een lijst van vakken die als gepind worden gemarkeerd.

    Raises:
        serializers.ValidationError: Als de gebruiker deel moet uitmaken van alle gepinde vakken.
    """
    if instance.is_lesgever:
        vakken = Vak.objects.filter(lesgevers=instance.user.id)
    else:
        vakken = Vak.objects.filter(studenten=instance.user.id)

    if not all(item in vakken for item in gepinde_vakken):
        raise serializers.ValidationError(
            "De gebruiker moet deel uitmaken van een vak voordat hij/zij dat vak kan markeren als een gepind vak"
        )
