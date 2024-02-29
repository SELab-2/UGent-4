from rest_framework import serializers
from api.models import Student


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
