from rest_framework import serializers
from api.models.gebruiker import Gebruiker

class GebruikerSerializer(serializers.ModelSerializer):
    """
    Serializer voor het serialiseren en deserialiseren van Gebruiker objecten.

    Fields:
        Meta.model (Gebruiker): Het model waarop de serializer is gebaseerd.
        Meta.fields (tuple): De velden die moeten worden opgenomen in de serializer.
        Hier wordt '__all__' gebruikt om alle velden op te nemen.

    Methods:
        create(self, validated_data): Maakt een nieuwe gebruiker aan en voegt deze toe aan de database.
        update(self, instance, validated_data): Werkt een bestaande gebruiker bij in de database.
    """

    first_name = serializers.CharField(source='user.first_name', read_only=True)
    last_name = serializers.CharField(source='user.last_name', read_only=True)
    email = serializers.EmailField(source='user.email', read_only=True)

    class Meta:
        model = Gebruiker
        fields = ['user', 'is_lesgever', 'first_name', 'last_name', 'email']

    def create(self, validated_data):
        """
        Args:
            validated_data (dict): Gevalideerde gegevens over de gebruiker.

        Returns:
            Gebruiker: De aangemaakte gebruiker.
        """
        instance = Gebruiker.objects.create(**validated_data)
        return instance

    def update(self, instance, validated_data):
        """
        Args:
            instance (Gebruiker): De gebruiker die moet worden bijgewerkt.
            validated_data (dict): Gevalideerde gegevens over de gebruiker.

        Returns:
            Gebruiker: De bijgewerkte gebruiker.
        """
        instance.is_lesgever = validated_data.pop("is_lesgever")
        instance.save()
        return instance
