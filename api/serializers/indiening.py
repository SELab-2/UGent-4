from rest_framework import serializers
from api.models.indiening import Indiening


class IndieningSerializer(serializers.ModelSerializer):
    """
    Serializer voor het serialiseren en deserialiseren van Indiening objecten.

    Fields:
        Meta.model (Indiening): Het model waarop de serializer is gebaseerd.
        Meta.fields (tuple): De velden die moeten worden opgenomen in de serializer. Hier worden alle velden opgenomen.

    """

    class Meta:
        model = Indiening
        fields = [
            "indiening_id",
            "groep",
            "tijdstip",
            "bestand",
            "status",
            "result",
            "artefacten",
        ]
