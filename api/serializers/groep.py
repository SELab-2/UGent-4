from rest_framework import serializers
from api.models.groep import Groep


class GroepSerializer(serializers.ModelSerializer):
    class Meta:
        model = Groep
        fields = '__all__'

    def create(self, validated_data):
        return Groep.objects.create(**validated_data)
