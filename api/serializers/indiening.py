from rest_framework import serializers
from api.models.indiening import Indiening, IndieningBestand


class IndieningBestandSerializer(serializers.ModelSerializer):
    """
    Serializer voor het serialiseren en deserialiseren van IndieningBestand objecten.

    Fields:
        Meta.model (IndieningBestand): Het model waarop de serializer is gebaseerd.
        Meta.fields (tuple): De velden die moeten worden opgenomen in de serializer. Hier worden alle velden opgenomen.

    """

    class Meta:
        model = IndieningBestand
        fields = "__all__"

class IndieningSerializer(serializers.ModelSerializer):
    """
    Serializer voor het serialiseren en deserialiseren van Indiening objecten.

    Fields:
        Meta.model (Indiening): Het model waarop de serializer is gebaseerd.
        Meta.fields (tuple): De velden die moeten worden opgenomen in de serializer. Hier worden alle velden opgenomen.

    """
    indiening_bestanden = IndieningBestandSerializer(many=True, read_only=True)

    class Meta:
        model = Indiening
        fields = ['indiening_id', 'groep', 'tijdstip', 'status', 'indiening_bestanden']
