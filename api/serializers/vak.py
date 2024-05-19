from rest_framework import serializers
from api.models.vak import Vak
from api.models.project import Project
from api.models.groep import Groep
from api.serializers.groep import GroepSerializer


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

        validate_students_teachers(students_data, teachers_data)

        vak = Vak.objects.create(**validated_data)
        vak.studenten.set(students_data)
        vak.lesgevers.set(teachers_data)

        return vak

    def update(self, instance, validated_data):
        """
        Args:
            instance (Vak): Het vak dat moet worden bijgewerkt.
            validated_data (dict): Gevalideerde gegevens over het vak.

        Returns:
            Vak: Het bijgewerkte vak.
        """
        students_data = validated_data.pop("studenten", instance.studenten.all())
        teachers_data = validated_data.pop("lesgevers", instance.lesgevers.all())

        validate_students_teachers(students_data, teachers_data)

        super().update(instance=instance, validated_data=validated_data)
        instance.studenten.set(students_data)
        instance.lesgevers.set(teachers_data)

        instance.save()

        add_students_to_group(instance)

        return instance


def add_students_to_group(instance):
    """
    Voeg studenten automatisch toe aan een projectgroep als het een individueel project is.

    Args:
        instance (Vak): Een object dat een vak vertegenwoordigt met een verzameling van studenten.
    """
    projecten = Project.objects.filter(vak=instance.vak_id)
    for project in projecten:
        if project.student_groep or project.max_groep_grootte == 1:
            for student in instance.studenten.all():
                try:
                    serializer = GroepSerializer(
                        data={"studenten": [student], "project": project.project_id}
                    )
                    if serializer.is_valid():
                        serializer.save()
                except Exception:
                    pass

        else:
            groepen = Groep.objects.filter(project=project.project_id)
            nieuwe_groepen = len(instance.studenten.all())//project.max_groep_grootte + 1 - len(groepen)
            for _ in range(nieuwe_groepen):
                try:
                    serializer = GroepSerializer(
                        data={"studenten": [], "project": project.project_id}
                    )
                    if serializer.is_valid():
                        serializer.save()
                except Exception:
                    pass


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
