from django.http import FileResponse
from rest_framework.decorators import api_view
from rest_framework.response import Response
from rest_framework import status

from api.models.project import Project
from api.models.vak import Vak
from api.serializers.project import ProjectSerializer
from api.utils import has_permissions, contains


@api_view(["GET", "POST"])
def project_list(request, format=None):
    """
    Een view om een lijst van projecten op te halen of een nieuw project toe te voegen.

    GET:
    Als de gebruiker een lesgever is, worden alle projecten opgehaald.
    Als de gebruiker geen lesgever is, worden alleen de projecten opgehaald
    voor de vakken waarin de ingelogde gebruiker zich bevindt.

    Optionele query parameters:
        vak (int): Filtert projecten op basis van vak-ID.

    POST:
    Voegt een nieuw project toe.

    Returns:
        Response: Een lijst van projecten of een nieuw aangemaakt project.
    """
    if request.method == "GET":
        if has_permissions(request.user):
            projects = Project.objects.all()
        else:
            vakken = Vak.objects.filter(studenten=request.user.id)
            projects = Project.objects.filter(vak__in=vakken).filter(zichtbaar=True)

        if "vak" in request.GET:
            try:
                vak = eval(request.GET.get("vak"))
                projects = projects.filter(vak=vak)
            except NameError:
                return Response(status=status.HTTP_400_BAD_REQUEST)

        serializer = ProjectSerializer(projects, many=True)
        return Response(serializer.data)

    elif request.method == "POST":
        if has_permissions(request.user):
            serializer = ProjectSerializer(data=request.data)
            if serializer.is_valid():
                serializer.save()
                return Response(serializer.data, status=status.HTTP_201_CREATED)
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
        return Response(status=status.HTTP_403_FORBIDDEN)


@api_view(["GET", "PUT", "PATCH", "DELETE"])
def project_detail(request, id, format=None):
    """
    Een view om de gegevens van een specifiek project op te halen (GET),
    bij te werken (PUT, PATCH) of te verwijderen (DELETE).

    Args:
        id (int): De primaire sleutel van het project.

    Returns:
        Response: Gegevens van het project of een foutmelding als het project niet
        bestaat of als er een ongeautoriseerde toegang is.
    """
    try:
        project = Project.objects.get(pk=id)
    except Project.DoesNotExist:
        return Response(status=status.HTTP_404_NOT_FOUND)

    if request.method == "GET":
        if has_permissions(request.user) or contains(project.vak.studenten, request.user):
            serializer = ProjectSerializer(project)
            return Response(serializer.data)
        return Response(status=status.HTTP_403_FORBIDDEN)

    if has_permissions(request.user):
        if request.method in ["PUT", "PATCH"]:
            if request.method == "PUT":
                serializer = ProjectSerializer(project, data=request.data)
            else:
                serializer = ProjectSerializer(project, data=request.data, partial=True)
            if serializer.is_valid():
                serializer.save()
                return Response(serializer.data)
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

        elif request.method == "DELETE":
            project.delete()
            return Response(status=status.HTTP_204_NO_CONTENT)
    return Response(status=status.HTTP_403_FORBIDDEN)


@api_view(["GET"])
def project_detail_download_opgave(request, id, format=None):
    """
    Een view om de opdracht van een specifiek project te downloaden.

    Args:
        id (int): De primaire sleutel van het project.
        format (str, optional): Het gewenste formaat voor de respons. Standaard is None.

    Returns:
        Response: Een bestandsrespons met de opdracht van het project als bijlage,
        indien de gebruiker een lesgever is of betrokken is bij het vak van het project.
        Anders wordt een foutmelding geretourneerd.
    """
    try:
        project = Project.objects.get(pk=id)
    except Project.DoesNotExist:
        return Response(status=status.HTTP_404_NOT_FOUND)

    if has_permissions(request.user) or contains(project.vak.studenten, request.user):
        return FileResponse(project.opgave_bestand.open(), as_attachment=True)
    return Response(status=status.HTTP_403_FORBIDDEN)
