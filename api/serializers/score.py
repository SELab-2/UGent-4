from rest_framework import serializers
from api.models.score import Score


class ScoreSerializer(serializers.ModelSerializer):
    """
    Serializer voor het serialiseren en deserialiseren van Score objecten.

    Fields:
        Meta.model (Score): Het model waarop de serializer is gebaseerd.
        Meta.fields (tuple): De velden die moeten worden opgenomen in de serializer. Hier wordt '__all__' gebruikt om alle velden op te nemen.

    Methods:
        create(self, validated_data): Maakt een nieuwe score aan en voegt deze toe aan de database.
        update(self, instance, validated_data): Werkt een bestaande score bij in de database.
    """
    class Meta:
        model = Score
        fields = '__all__'

    def create(self, validated_data):
        """
        Args:
            validated_data (dict): Gevalideerde gegevens over de score.

        Returns:
            Score: De aangemaakte score.
        """
        if Score.objects.filter(indiening=validated_data.get('indiening')).exists():
            raise serializers.ValidationError("Deze indiening heeft al een bestaande score")
        validate_score(validated_data)
        return Score.objects.create(**validated_data)

    def update(self, instance, validated_data):
        """
        Args:
            instance (Score): De score die moet worden bijgewerkt.
            validated_data (dict): Gevalideerde gegevens over de score.

        Returns:
            Score: De bijgewerkte score.
        """
        validate_score(validated_data)
        validate_indiening(instance, validated_data)
        super().update(instance=instance, validated_data=validated_data)
        instance.save()
        return instance

def validate_score(data):
    """
    Controleert of de opgegeven score niet hoger is dan de maximale score van het bijbehorende project.

    Args:
        data (dict): Gevalideerde gegevens over de score.

    Raises:
        serializers.ValidationError: Als de score hoger is dan de maximale score van het bijbehorende project.
    """
    max_score = data.get('indiening').groep.project.max_score
    if data['score'] > max_score:
        raise serializers.ValidationError(f'Score kan niet hoger zijn dan de maximale score van {max_score}')
  
def validate_indiening(instance, data):
    """
    Controleert of de indiening_id niet wordt aangepast.

    Args:
        instance (Score): De score die moet worden bijgewerkt.
        data (dict): Gevalideerde gegevens over de score.

    Raises:
        serializers.ValidationError: Als de indiening_id wordt aangepast.
    """
    if instance.indiening != data.get('indiening'):
        raise serializers.ValidationError('indiening_id kan niet aangepast worden')
    

