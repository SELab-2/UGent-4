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
        
        validate_students_teachers(students_data, teachers_data)

        vak = Vak.objects.create(**validated_data)
        vak.students.set(students_data)
        vak.teachers.set(teachers_data)
        vak.projects.set(projects_data)

        populate_student_teacher_vakken(vak)

        return vak

    def update(self, instance, validated_data):
        instance.name = validated_data.pop('name')

        students_data = validated_data.pop('students', [])
        teachers_data = validated_data.pop('teachers', [])
        projects_data = validated_data.pop('projects', [])

        validate_students_teachers(students_data, teachers_data)

        depopulate_student_teacher_vakken(instance)

        instance.students.clear()
        instance.teachers.clear()
        instance.projects.clear()

        instance.students.set(students_data)
        instance.teachers.set(teachers_data)
        instance.projects.set(projects_data)

        instance.save()

        populate_student_teacher_vakken(instance)
        
        return instance
    
def validate_students_teachers(students_data, teachers_data):
    for student in students_data:
        if student.is_lesgever:
            raise serializers.ValidationError("Alle gebruikers in 'students' moeten studenten zijn")

    for teacher in teachers_data:
        if not teacher.is_lesgever:
            raise serializers.ValidationError("Alle gebruikers in 'teachers' moeten lesgevers zijn")

def populate_student_teacher_vakken(vak):
    for student in vak.students.all():
        student.subjects.add(vak)

    for teacher in vak.teachers.all():
        teacher.subjects.add(vak)

def depopulate_student_teacher_vakken(vak):
    for student in vak.students.all():
        student.subjects.remove(vak)

    for teacher in vak.teachers.all():
        teacher.subjects.remove(vak)