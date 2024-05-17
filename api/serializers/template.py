from rest_framework import serializers
from api.models.template import Template


class TemplateSerializer(serializers.ModelSerializer):
    """
    Serializer voor het serialiseren en deserialiseren van IndieningBestand objecten.

    Fields:
        Meta.model (IndieningBestand): Het model waarop de serializer is gebaseerd.
        Meta.fields (tuple): De velden die moeten worden opgenomen in de serializer. Hier worden alle velden opgenomen.

    """

    class Meta:
        model = Template
        fields = "__all__"
