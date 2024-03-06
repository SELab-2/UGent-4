from rest_framework import serializers
from api.models.vak import Vak


class VakSerializer(serializers.ModelSerializer):
    class Meta:
        model = Vak
        fields = '__all__'

    def create(self, validated_data):
        return Vak.objects.create(**validated_data)
