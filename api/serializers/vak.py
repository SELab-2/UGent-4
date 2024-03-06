from rest_framework import serializers
from api.models.vak import Vak


class VakSerializer(serializers.ModelSerializer):
    class Meta:
        model = Vak
        fields = '__all__'
    
    def create(self, validated_data):
        students_data = validated_data.pop('students')
        teachers_data = validated_data.pop('teachers')
        projects_data = validated_data.pop('projects')
        vak = Vak.objects.create(**validated_data)
        vak.students.set(students_data)
        vak.teachers.set(teachers_data)
        vak.projects.set(projects_data)
        return vak

    def update(self, instance, validated_data):
        instance.name = validated_data.pop('name')


        students_data = validated_data.pop('students', [])
        teachers_data = validated_data.pop('teachers', [])
        projects_data = validated_data.pop('projects', [])
        instance.students.clear()
        instance.teachers.clear()
        instance.projects.clear()

        instance.students.set(students_data)
        instance.teachers.set(teachers_data)
        instance.projects.set(projects_data)

        instance.save()
        
        return instance
