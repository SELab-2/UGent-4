from rest_framework import serializers
from api.models.indiening import Indiening, IndieningBestand


class IndieningSerializer(serializers.ModelSerializer):
    class Meta:
        model = Indiening
        fields = "__all__"


class IndieningBestandSerializer(serializers.ModelSerializer):
    class Meta:
        model = IndieningBestand
        fields = "__all__"
