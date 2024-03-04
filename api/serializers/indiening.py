from rest_framework import serializers
from api.models.indiening import Indiening


class IndieningSerializer(serializers.ModelSerializer):
    class Meta:
        model = Indiening
        fields = '__all__'

    def create(self, validated_data):
        return Indiening.objects.create(**validated_data)

    def update(self, instance, validated_data):
        # Implement update method for Indiening model
        pass
