from rest_framework import serializers
from api.models.score import Score


class ScoreSerializer(serializers.ModelSerializer):
    class Meta:
        model = Score
        fields = '__all__'

    def create(self, validated_data):
        return Score.objects.create(**validated_data)

    def update(self, instance, validated_data):
        # Implement update method for Score model
        pass
