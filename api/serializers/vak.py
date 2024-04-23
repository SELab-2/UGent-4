from rest_framework import serializers
from api.models.vak import Vak


class VakSerializer(serializers.ModelSerializer):
    """
    Serializer voor het serialiseren en deserialiseren van Vak objecten.

    Fields:
        Meta.model (Vak): Het model waarop de serializer is gebaseerd.
        Meta.fields (tuple): De velden die moeten worden opgenomen in de serializer.
        Hier wordt '__all__' gebruikt om alle velden op te nemen.

    Methods:
        create(self, validated_data): Maakt een nieuw vak aan en voegt deze toe aan de database.
        update(self, instance, validated_data): Werkt een bestaand vak bij in de database.
    """

    class Meta:
        model = Vak
        fields = "__all__"

    def create(self, validated_data):
        """
        Args:
            validated_data (dict): Gevalideerde gegevens over het vak.

        Returns:
            Vak: Het aangemaakte vak.
        """
        students_data = validated_data.pop("studenten")
        teachers_data = validated_data.pop("lesgevers")
        invited_data = validated_data.pop("invited")

        validate_students_teachers(students_data, teachers_data)

        vak = Vak.objects.create(**validated_data)
        vak.studenten.set(students_data)
        vak.lesgevers.set(teachers_data)
        vak.invited.set(invited_data)

        return vak

    def update(self, instance, validated_data):
        """
        Args:
            instance (Vak): Het vak dat moet worden bijgewerkt.
            validated_data (dict): Gevalideerde gegevens over het vak.

        Returns:
            Vak: Het bijgewerkte vak.
        """
        students_data = validated_data.pop("studenten", instance.studenten)
        teachers_data = validated_data.pop("lesgevers", instance.lesgevers)
        invited_data = validated_data.pop("invited", instance.invited)

        validate_students_teachers(students_data, teachers_data)

        super().update(instance=instance, validated_data=validated_data)
        instance.studenten.set(students_data)
        instance.lesgevers.set(teachers_data)
        instance.invited.set(invited_data)

        instance.save()
        return instance


def validate_students_teachers(students_data, teachers_data):
    """
    Controleert of alle gebruikers in 'studenten' studenten zijn en alle gebruikers in 'lesgevers' lesgevers zijn.

    Args:
        students_data (list): Een lijst met gebruikers die aan het vak moeten worden toegevoegd als studenten.
        teachers_data (list): Een lijst met gebruikers die aan het vak moeten worden toegevoegd als lesgevers.

    Raises:
        serializers.ValidationError: Als een gebruiker in 'studenten' geen student is
        of een gebruiker in 'lesgevers' geen lesgever is.
    """
    for student in students_data:
        if student.is_lesgever:
            raise serializers.ValidationError(
                "Alle gebruikers in 'studenten' moeten studenten zijn"
            )

    for teacher in teachers_data:
        if not teacher.is_lesgever:
            raise serializers.ValidationError(
                "Alle gebruikers in 'lesgevers' moeten lesgevers zijn"
            )
