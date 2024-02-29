from rest_framework import serializers
from api.models import Vak


class VakSerializer(serializers.ModelSerializer):
    class Meta:
        model = Vak
        fields = '__all__'

    def create(self, validated_data):
        return Vak.objects.create(**validated_data)

    def update(self, instance, validated_data):
        instance.name = validated_data.get('name', instance.name)
        # Update other fields similarly
        instance.save()
        return instance