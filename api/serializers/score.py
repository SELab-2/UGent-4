from rest_framework import serializers
from api.models.score import Score


class ScoreSerializer(serializers.ModelSerializer):
    class Meta:
        model = Score
        fields = '__all__'

    def create(self, validated_data):
        if Score.objects.filter(indiening=validated_data.get('indiening')).exists():
            raise serializers.ValidationError("Deze indiening heeft al een bestaande score")
        validate_score(validated_data)
        return Score.objects.create(**validated_data)
    
    def update(self, instance, validated_data):
        validate_score(validated_data)
        super().update(instance=instance, validated_data=validated_data)
        instance.save()
        return instance
    
def validate_score(data):
    max_score = data.get('indiening').groep.project.max_score
    if data['score'] > max_score:
        raise serializers.ValidationError(f'Score kan niet hoger zijn dan de maximale score van {max_score}')
    

