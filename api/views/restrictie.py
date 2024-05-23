from django.http import FileResponse
from rest_framework.decorators import api_view
from rest_framework.response import Response
from rest_framework import status

from api.models.restrictie import Restrictie
from api.serializers.restrictie import RestrictieSerializer
from api.utils import has_permissions


@api_view(["GET", "POST"])
def restrictie_list(request, format=None):
    """
    API-weergave voor het ophalen en maken van restricties.

    GET: Haalt alle restricties op, optioneel gefilterd op project en moet_slagen.
    POST: Maakt een nieuwe restrictie.

    Args:
        request (HttpRequest): Het http-verzoek dat is ontvangen.

    Returns:
        Response: Een http-respons met de opgevraagde of gemaakte restricties.
    """

    if request.method == "GET":
        restricties = Restrictie.objects.all()

        if "project" in request.GET:
            try:
                project = eval(request.GET.get("project"))
                restricties = restricties.filter(project=project)
            except NameError:
                return Response(status=status.HTTP_400_BAD_REQUEST)

        if "moet_slagen" in request.GET and request.GET.get("moet_slagen").lower() in [
            "true",
            "false",
        ]:
            restricties = restricties.filter(
                moet_slagen=(request.GET.get("moet_slagen").lower() == "true")
            )

        serializer = RestrictieSerializer(restricties, many=True)
        return Response(serializer.data)

    if has_permissions(request.user):
        if request.method == "POST":
            serializer = RestrictieSerializer(data=request.data)
            if serializer.is_valid():
                serializer.save()
                return Response(serializer.data, status=status.HTTP_201_CREATED)
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    return Response(status=status.HTTP_403_FORBIDDEN)


@api_view(["GET", "PUT", "PATCH", "DELETE"])
def restrictie_detail(request, id, format=None):
    """
    Een view om de details van een restrictie op te halen, bij te werken of te verwijderen.

    GET:
    Haalt de details van een restrictie op als de gebruiker een lesgever is.

    PUT, PATCH:
    Werkt de details van een restrictie bij als de gebruiker een lesgever is.

    DELETE:
    Verwijdert een restrictie als de gebruiker een lesgever is.

    Args:
        request (HttpRequest): Het http-verzoek dat is ontvangen.
        id (int): Het identificatienummer van de restrictie.

    Returns:
        Response: Een http-respons met de opgevraagde, bijgewerkte of verwijderde restrictie.
    """
    try:
        restrictie = Restrictie.objects.get(pk=id)
    except Restrictie.DoesNotExist:
        return Response(status=status.HTTP_404_NOT_FOUND)

    if has_permissions(request.user):
        if request.method == "GET":
            serializer = RestrictieSerializer(restrictie)
            return Response(serializer.data)

        if request.method in ["PUT", "PATCH"]:
            if request.method == "PUT":
                serializer = RestrictieSerializer(restrictie, data=request.data)
            else:
                serializer = RestrictieSerializer(
                    restrictie, data=request.data, partial=True
                )
            if serializer.is_valid():
                serializer.save()
                return Response(serializer.data)
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

        elif request.method == "DELETE":
            restrictie.delete()
            return Response(status=status.HTTP_204_NO_CONTENT)
    return Response(status=status.HTTP_403_FORBIDDEN)


@api_view(["GET"])
def restrictie_detail_download_script(request, id, format=None):
    """
    Een view om het script van een specifieke restrictie te downloaden.

    Args:
        id (int): De primaire sleutel van de restrictie.
        format (str, optional): Het gewenste formaat voor de respons. Standaard is None.

    Returns:
        Response: Een bestandsrespons met het script van de restrictie als bijlage,
        indien de gebruiker een lesgever is. Anders wordt een foutmelding geretourneerd.
    """
    try:
        restrictie = Restrictie.objects.get(pk=id)
    except Restrictie.DoesNotExist:
        return Response(status=status.HTTP_404_NOT_FOUND)

    if has_permissions(request.user):
        return FileResponse(restrictie.script.open(), as_attachment=True)
    return Response(status=status.HTTP_403_FORBIDDEN)
