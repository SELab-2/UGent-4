from rest_framework import serializers
from api.models.score import Score


class ScoreSerializer(serializers.ModelSerializer):
    class Meta:
        model = Score
        fields = '__all__'

    def create(self, validated_data):
        """
        Creates a new score to put in the database.

        Args:
            validated_data: Data about the score.
        """
        if Score.objects.filter(indiening=validated_data.get('indiening')).exists():
            raise serializers.ValidationError("Deze indiening heeft al een bestaande score")
        validate_score(validated_data)
        return Score.objects.create(**validated_data)

    def update(self, instance, validated_data):
        """
        Updates a groep in the database.

        Args:
            instance: Instance to be updated.
            validated_data: Data about the groep.
        """
        validate_score(validated_data)
        validate_indiening(instance, validated_data)
        super().update(instance=instance, validated_data=validated_data)
        instance.save()
        return instance

def validate_score(data):
    """
    Checks the validity of the data and raises an error if the data is invalid.
    The data is invalid when the score is higher than the maximal score.
    """
    max_score = data.get('indiening').groep.project.max_score
    if data['score'] > max_score:
        raise serializers.ValidationError(f'Score kan niet hoger zijn dan de maximale score van {max_score}')
  
def validate_indiening(instance, data):
    if instance.indiening != data.get('indiening'):
        raise serializers.ValidationError('indiening_id kan niet aangepast worden')
    

