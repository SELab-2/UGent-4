from rest_framework import serializers
from api.models.project import Project
from django.utils import timezone


class ProjectSerializer(serializers.ModelSerializer):
    class Meta:
        model = Project
        fields = '__all__'

    def create(self, validated_data):
        deadline = validated_data.pop('deadline')
        validate_deadline(deadline)

        project = Project.objects.create(**validated_data)
        project.deadline = deadline
        project.save()
        return project
    
    def update(self, instance, validated_data):
        deadline = validated_data.pop('deadline')
        validate_deadline(deadline)

        super().update(instance=instance, validated_data=validated_data)
        instance.deadline = deadline
        instance.save()
        return instance
    

def validate_deadline(deadline):
    if deadline <= timezone.now():
        raise serializers.ValidationError("Deadline moet in de toekomst liggen")