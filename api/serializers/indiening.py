from rest_framework import serializers
from api.models.indiening import Indiening


class IndieningSerializer(serializers.ModelSerializer):
    class Meta:
        model = Indiening
        fields = '__all__'

    def create(self, validated_data):
        # indiener is een groep, dus zeker student(en)
        indiening = Indiening.objects.create(**validated_data)
        return indiening
    
    def update(self, instance, validated_data):
        instance = Indiening.objects.create(**validated_data)
        instance.save()
        return instance
