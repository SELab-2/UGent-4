from rest_framework import serializers
from api.models.score import Score


class ScoreSerializer(serializers.ModelSerializer):
    class Meta:
        model = Score
        fields = "__all__"

    def create(self, validated_data):
        return Score.objects.create(**validated_data)
