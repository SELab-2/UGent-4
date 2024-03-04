from datetime import datetime
from rest_framework import serializers
from rest_framework.renderers import JSONRenderer
import io
from rest_framework.parsers import JSONParser

from .models import Student, Lesgever, Vak, Groep, Project, Indiening, Score, Dummy



class DummySerializer(serializers.ModelSerializer):
    class Meta:
        model = Dummy
        fields = '__all__'

    def create(self, validated_data):
        return Dummy.objects.create(**validated_data)

class StudentSerializer(serializers.ModelSerializer):
    class Meta:
        model = Student
        fields = '__all__'

    def create(self, validated_data):
        return Student.objects.create(**validated_data)

    def update(self, instance, validated_data):
        # Update the regular fields
        instance.name = validated_data.get('name', instance.name)
        instance.email = validated_data.get('email', instance.email)
        # Update the subjects list
        subjects_data = validated_data.pop('subjects', None)
        if subjects_data is not None:
            instance.subjects.clear()  # Remove existing subjects
            for subject_data in subjects_data:
                instance.subjects.add(subject_data)

        instance.save()
        return instance

class LesgeverSerializer(serializers.ModelSerializer):
    class Meta:
        model = Lesgever
        fields = '__all__'

    def create(self, validated_data):
        return Lesgever.objects.create(**validated_data)

    def update(self, instance, validated_data):
        instance.name = validated_data.get('name', instance.name)
        # Update other fields similarly
        instance.save()
        return instance

class VakSerializer(serializers.ModelSerializer):
    class Meta:
        model = Vak
        fields = '__all__'

    def create(self, validated_data):
        return Vak.objects.create(**validated_data)

    def update(self, instance, validated_data):
        instance.name = validated_data.get('name', instance.name)
        # Update other fields similarly
        instance.save()
        return instance

class GroepSerializer(serializers.ModelSerializer):
    class Meta:
        model = Groep
        fields = '__all__'
    
    def create(self, validated_data):
        return Groep.objects.create(**validated_data)

    def update(self, instance, validated_data):
        # Implement update method for Groep model
        pass

class ProjectSerializer(serializers.ModelSerializer):
    class Meta:
        model = Project
        fields = '__all__'
    
    def create(self, validated_data):
        return Project.objects.create(**validated_data)

    def update(self, instance, validated_data):
        # Implement update method for Project model
        pass

class IndieningSerializer(serializers.ModelSerializer):
    class Meta:
        model = Indiening
        fields = '__all__'
    
    def create(self, validated_data):
        return Indiening.objects.create(**validated_data)

    def update(self, instance, validated_data):
        # Implement update method for Indiening model
        pass

class ScoreSerializer(serializers.ModelSerializer):
    class Meta:
        model = Score
        fields = '__all__'

    def create(self, validated_data):
        return Score.objects.create(**validated_data)

    def update(self, instance, validated_data):
        # Implement update method for Score model
        pass



# gebruiksvoorbeelden

# serializing objects
#serializer = ProfSerializer(prof)
#serializer.data
#json = JSONRenderer().render(serializer.data)
#json

#deserializing objects
#stream = io.BytesIO(json)
#data = JSONParser().parse(stream)
#serializer = ProfSerializer(data=data)
#serializer.is_valid()
#serializer.validated_data
#serializer.save()
