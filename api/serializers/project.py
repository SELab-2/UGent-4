from rest_framework import serializers
from api.models.project import Student, Lesgever, Vak, Groep, Project, Indiening, Score


class ProjectSerializer(serializers.ModelSerializer):
    class Meta:
        model = Project
        fields = '__all__'

    def create(self, validated_data):
        return Project.objects.create(**validated_data)

    def update(self, instance, validated_data):
        # Implement update method for Project model
        pass
