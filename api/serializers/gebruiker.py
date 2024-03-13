from rest_framework import serializers
from api.models.gebruiker import Gebruiker


class GebruikerSerializer(serializers.ModelSerializer):
    class Meta:
        model = Gebruiker
        fields = "__all__"

    def create(self, validated_data):
        instance = Gebruiker.objects.create(**validated_data)
        return instance

    def update(self, instance, validated_data):
        instance.is_lesgever = validated_data.pop("is_lesgever")
        instance.save()
        return instance
