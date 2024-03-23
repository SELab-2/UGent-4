from rest_framework import serializers
from api.models.restrictie import Restrictie


class ProjectSerializer(serializers.ModelSerializer):
    """
    TODO
    """

    class Meta:
        model = Restrictie
        fields = "__all__"

    def update(self, instance, validated_data):
        """
        Args:
            instance (Project): Het project dat moet worden bijgewerkt.
            validated_data (dict): Gevalideerde gegevens over het project.

        Returns:
            Project: Het bijgewerkte project.
        """
        project = validated_data.get('project')
        validate_project(instance, project)

        super().update(instance=instance, validated_data=validated_data)
        instance.save()
        return instance


def validate_project(instance, new_project):
    """
    TODO
    """

    if instance.project != new_project:
        raise serializers.ValidationError('Het project van een restrictie kan niet aangepast worden')
