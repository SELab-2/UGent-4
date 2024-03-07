from rest_framework import serializers
from api.models.vak import Vak


class VakSerializer(serializers.ModelSerializer):
    class Meta:
        model = Vak
        fields = '__all__'
    
    def create(self, validated_data):
        students_data = validated_data.pop('students')
        teachers_data = validated_data.pop('teachers')
        
        validate_students_teachers(students_data, teachers_data)

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

        validate_students_teachers(students_data, teachers_data)

        projects_data = validated_data.pop('projects', [])
        clear(instance.students)
        clear(instance.teachers)
        clear(instance.projects)

        instance.students.set(students_data)
        instance.teachers.set(teachers_data)
        instance.projects.set(projects_data)

        instance.save()
        
        return instance
    
def validate_students_teachers(students_data, teachers_data):
    for student in students_data:
        if student.is_lesgever:
            raise serializers.ValidationError("Alle gebruikers in 'students' moeten studenten zijn")

    for teacher in teachers_data:
        if not teacher.is_lesgever:
            raise serializers.ValidationError("Alle gebruikers in 'teachers' moeten lesgevers zijn")

def clear(set):
    for item in set.all(): 
            set.remove(item)
