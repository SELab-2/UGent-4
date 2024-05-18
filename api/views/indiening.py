from rest_framework.decorators import api_view
from rest_framework.response import Response
from rest_framework import status

from api.models.indiening import Indiening
from api.models.groep import Groep
from api.models.vak import Vak
from api.models.project import Project
from api.serializers.indiening import IndieningSerializer
from api.utils import has_permissions, contains, is_lesgever

from django.http import FileResponse


@api_view(["GET", "POST"])
def indiening_list(request, format=None):
    """
    Een view om een lijst van indieningen op te halen of een nieuwe indiening toe te voegen.

    GET:
    Als de gebruiker een lesgever is, worden alle indieningen opgehaald.
    Als de gebruiker geen lesgever is, worden alleen de indieningen opgehaald
    waarin de ingelogde gebruiker zich bevindt.

    Optionele query parameters:
        groep (int): Filtert indieningen op basis van groep-ID.

    POST:
    Voegt een nieuwe indiening toe.

    Returns:
        Response: Een lijst van indieningen of een nieuw aangemaakte indiening.
    """
    if request.method == "GET":
        if has_permissions(request.user):
            indieningen = Indiening.objects.all()
        else:
            groepen = Groep.objects.filter(studenten=request.user.id)
            indieningen = Indiening.objects.filter(groep__in=groepen)

        if "groep" in request.GET:
            try:
                groep = eval(request.GET.get("groep"))
                indieningen = indieningen.filter(groep=groep)
            except NameError:
                return Response(status=status.HTTP_400_BAD_REQUEST)

        if "project" in request.GET:
            try:
                project = Project.objects.get(pk=eval(request.GET.get("project")))
                groepen = Groep.objects.filter(project=project)
                indieningen = indieningen.filter(groep__in=groepen)
            except (NameError, Project.DoesNotExist):
                return Response(status=status.HTTP_400_BAD_REQUEST)

        if "vak" in request.GET:
            try:
                vak = Vak.objects.get(pk=eval(request.GET.get("vak")))
                projecten = Project.objects.filter(vak=vak)
                groepen = Groep.objects.filter(project__in=projecten)
                indieningen = indieningen.filter(groep__in=groepen)
            except (NameError, Vak.DoesNotExist):
                return Response(status=status.HTTP_400_BAD_REQUEST)

        serializer = IndieningSerializer(indieningen, many=True)
        return Response(serializer.data)

    elif request.method == "POST":
        serializer = IndieningSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save()
        else:
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

        return Response(serializer.data, status=status.HTTP_201_CREATED)


@api_view(["GET", "DELETE"])
def indiening_detail(request, id, format=None):
    """
    Een view om de gegevens van een specifieke indiening op te halen (GET) of te verwijderen (DELETE).

    Args:
        id (int): De primaire sleutel van de indiening.

    Returns:
        Response: Gegevens van de indiening of een foutmelding als de indiening niet bestaat of
        als er een ongeautoriseerde toegang is.
    """
    try:
        indiening = Indiening.objects.get(pk=id)
    except Indiening.DoesNotExist:
        return Response(status=status.HTTP_404_NOT_FOUND)

    if request.method == "GET":
        if has_permissions(request.user) or contains(
            indiening.groep.studenten, request.user
        ):
            serializer = IndieningSerializer(indiening)
            return Response(serializer.data)
        return Response(status=status.HTTP_403_FORBIDDEN)

    elif request.method == "DELETE":
        if has_permissions(request.user):
            indiening.delete()
            return Response(status=status.HTTP_204_NO_CONTENT)
        return Response(status=status.HTTP_403_FORBIDDEN)


@api_view(["GET"])
def indiening_detail_download_bestand(request, id, format=None):
    """
    Een view om de bestanden van een specifieke indiening te downloaden als een zip-archief.

    Args:
        id (int): De primaire sleutel van de indiening.
        format (str, optional): Het gewenste formaat voor de respons. Standaard is None.

    Returns:
        HttpResponse: Een zip-bestandsrespons met de bestanden van de indiening als bijlage,
        indien de gebruiker een lesgever is of betrokken is bij de groep van de indiening.
        Anders wordt een foutmelding geretourneerd.
    """
    try:
        indiening = Indiening.objects.get(pk=id)
    except Indiening.DoesNotExist:
        return Response(status=status.HTTP_404_NOT_FOUND)

    if has_permissions(request.user) or contains(
        indiening.groep.studenten, request.user
    ):

        return FileResponse(indiening.bestand.open(), as_attachment=True)

    return Response(status=status.HTTP_403_FORBIDDEN)


@api_view(["GET"])
def indiening_detail_download_artefacten(request, id, format=None):
    """
    Een view om de artefacten van een specifieke indiening te downloaden.

    Args:
        id (int): De primaire sleutel van de indiening.
        format (str, optional): Het gewenste formaat voor de respons. Standaard is None.

    Returns:
        Response: Een bestandsrespons met de artefacten van de indiening als bijlage,
        indien de gebruiker een lesgever is.
        Anders wordt een foutmelding geretourneerd.
    """
    try:
        indiening = Indiening.objects.get(pk=id)
    except Indiening.DoesNotExist:
        return Response(status=status.HTTP_404_NOT_FOUND)

    if has_permissions(request.user):
        try:
            return FileResponse(indiening.artefacten.open(), as_attachment=True)
        except (ValueError, FileNotFoundError):
            return Response(status=status.HTTP_404_NOT_FOUND)
    return Response(status=status.HTTP_403_FORBIDDEN)
