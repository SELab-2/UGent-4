from rest_framework import serializers
from api.models.lesgever import Lesgever


class LesgeverSerializer(serializers.ModelSerializer):
    class Meta:
        model = Lesgever
        fields = '__all__'

    def create(self, validated_data):
        return Lesgever.objects.create(**validated_data)
