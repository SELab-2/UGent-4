from rest_framework.decorators import api_view
from rest_framework.response import Response
from rest_framework import status

from api.models.groep import Groep
from api.serializers.groep import GroepSerializer
from api.utils import has_permissions


@api_view(["GET", "POST"])
def groep_list(request, format=None):
    """
    Een view om een lijst van groepen op te halen of een nieuwe groep toe te voegen.

    GET:
    Als de gebruiker een lesgever is, worden alle groepen opgehaald.
    Als de gebruiker geen lesgever is, worden alleen de groepen opgehaald waarin
    de ingelogde gebruiker zich bevindt.

    Optionele query parameters:
        project (int): Filtert groepen op basis van project-ID.
        student (int): Filtert groepen op basis van student-ID.

    POST:
    Als de gebruiker een lesgever is, wordt een nieuwe groep toegevoegd.

    Returns:
        Response: Een lijst van groepen of een nieuw aangemaakte groep.
    """
    if request.method == "GET":
        groepen = Groep.objects.all()

        if "project" in request.GET:
            try:
                project = eval(request.GET.get("project"))
                groepen = groepen.filter(project=project)
            except NameError:
                return Response(status=status.HTTP_400_BAD_REQUEST)

        if "student" in request.GET:
            try:
                student = eval(request.GET.get("student"))
                groepen = groepen.filter(studenten=student)
            except NameError:
                return Response(status=status.HTTP_400_BAD_REQUEST)

        serializer = GroepSerializer(groepen, many=True)
        return Response(serializer.data)

    elif request.method == "POST":
        if has_permissions(request.user):
            serializer = GroepSerializer(data=request.data)
            if serializer.is_valid():
                serializer.save()
                return Response(serializer.data, status=status.HTTP_201_CREATED)
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
        return Response(status=status.HTTP_403_FORBIDDEN)


@api_view(["GET", "PUT", "PATCH", "DELETE"])
def groep_detail(request, id, format=None):
    """
    Een view om de gegevens van een specifieke groep op te halen (GET),
    bij te werken (PUT, PATCH) of te verwijderen (DELETE).

    Args:
        id (int): De primaire sleutel van de groep.

    Returns:
        Response: Gegevens van de groep of een foutmelding als de groep niet bestaat of
        als er een ongeautoriseerde toegang is.
    """
    try:
        groep = Groep.objects.get(pk=id)
    except Groep.DoesNotExist:
        return Response(status=status.HTTP_404_NOT_FOUND)
    if request.method == "GET":
        serializer = GroepSerializer(groep)
        return Response(serializer.data)

    if request.method in ["PUT", "PATCH"]:
        if request.method == "PUT":
            serializer = GroepSerializer(groep, data=request.data)
        else:
            serializer = GroepSerializer(groep, data=request.data, partial=True)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    if has_permissions(request.user):
        if request.method == "DELETE":
            groep.delete()
            return Response(status=status.HTTP_204_NO_CONTENT)
    return Response(status=status.HTTP_403_FORBIDDEN)
