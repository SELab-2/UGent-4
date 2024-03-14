from rest_framework import serializers
from api.models.gebruiker import Gebruiker


class GebruikerSerializer(serializers.ModelSerializer):
    class Meta:
        model = Gebruiker
        fields = '__all__'

    def create(self, validated_data):
        """
        Creates a new gebruiker to put in the database.

        Args:
            validated_data: Data about the gebruiker.
        """
        instance = Gebruiker.objects.create(**validated_data)
        return instance

    def update(self, instance, validated_data):
        """
        Updates a gebruiker in the database.

        Args:
            instance: Instance to be updated.
            validated_data: Data about the gebruiker.
        """
        instance.is_lesgever = validated_data.pop('is_lesgever')
        instance.save()
        return instance
