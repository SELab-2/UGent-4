from rest_framework import serializers
from api.models.restrictie import Restrictie


class RestrictieSerializer(serializers.ModelSerializer):
    """
    TODO
    """

    class Meta:
        model = Restrictie
        fields = "__all__"

    def create(self, validated_data):
        """
        TODO
        """

        validate_script(validated_data.get('script'))
        return Restrictie.objects.create(**validated_data)

    def update(self, instance, validated_data):
        """
        TODO
        """
        validate_project(instance, validated_data.get('project'))
        validate_script(instance, validated_data.get('script'))

        super().update(instance=instance, validated_data=validated_data)
        instance.save()
        return instance


def validate_script(new_script):
    if not str(new_script).endswith('.sh') or not str(new_script).endswith('.py'):
        raise serializers.ValidationError('Het restrictie script moet een Python of Shell script zijn')


def validate_project(instance, new_project):
    """
    TODO
    """

    if instance.project != new_project:
        raise serializers.ValidationError('Het project van een restrictie kan niet aangepast worden')
