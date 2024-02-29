from rest_framework import serializers
from api.models import Lesgever


class LesgeverSerializer(serializers.ModelSerializer):
    class Meta:
        model = Lesgever
        fields = '__all__'

    def create(self, validated_data):
        return Lesgever.objects.create(**validated_data)

    def update(self, instance, validated_data):
        instance.name = validated_data.get('name', instance.name)
        # Update other fields similarly
        instance.save()
        return instance
