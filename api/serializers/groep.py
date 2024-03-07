from rest_framework import serializers
from api.models.groep import Groep


class GroepSerializer(serializers.ModelSerializer):
    class Meta:
        model = Groep
        fields = '__all__'

    def create(self, validated_data):
        students_data = validated_data.pop('students')
        
        validate_students(students_data)
        
        instance = Groep.objects.create(**validated_data)
        instance.students.set(students_data)
        return instance
    
    def update(self, validated_data):
        students_data = validated_data.pop('students')
        
        validate_students(students_data)
        
        instance = Groep.objects.create(**validated_data)
        instance.students.set(students_data)

        instance.save()
        return instance



def validate_students(students_data):
    for student in students_data:
        if student.is_lesgever:
            raise serializers.ValidationError("Alle gebruikers in 'students' moeten studenten zijn!")