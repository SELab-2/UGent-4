from rest_framework import serializers
from api.models.project import Project

from datetime import datetime


class ProjectSerializer(serializers.ModelSerializer):
    class Meta:
        model = Project
        fields = '__all__'

    def create(self, validated_data):
        deadline = validated_data.pop('deadline')

        validate_deadline(deadline)

        project = Project.objects.create(**validated_data)
        project.deadline.set(deadline)
        return project
    
    def update(self, instance, validated_data):
        deadline = validated_data.pop('deadline')

        validate_deadline(deadline)

        instance = Project.objects.create(**validated_data)
        instance.deadline.set(deadline)
        instance.save()
        return instance
    

def validate_deadline(deadline):
    if deadline <= datetime.now():
        raise serializers.ValidationError("Deadline moet in de toekomst liggen")