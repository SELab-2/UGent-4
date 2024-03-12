from rest_framework import serializers
from api.models.score import Score


class ScoreSerializer(serializers.ModelSerializer):
    class Meta:
        model = Score
        fields = '__all__'

    def create(self, validated_data):
        score =  Score.objects.create(**validated_data)
        return score
    
    def update(self, instance, validated_data):
        super().update(instance=instance, validated_data=validated_data)
        instance.save()
        return instance

