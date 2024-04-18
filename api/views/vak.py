from rest_framework.decorators import api_view
from rest_framework.response import Response
from rest_framework import status

from api.models.vak import Vak
from api.serializers.vak import VakSerializer
from api.utils import is_lesgever, contains


@api_view(["GET", "POST"])
def vak_list(request, format=None):
    """
    Een view om een lijst van vakken op te halen of een nieuw vak toe te voegen.

    GET:
    Als de gebruiker een lesgever is, worden alle vakken opgehaald.
    Als de gebruiker geen lesgever is, worden alleen de vakken opgehaald
    waarin de ingelogde gebruiker zich bevindt.

    POST:
    Voegt een nieuw vak toe.

    Returns:
        Response: Een lijst van vakken of een nieuw aangemaakt vak.
    """
    if request.method == "GET":
        if is_lesgever(request.user):
            vakken = Vak.objects.all()
        else:
            vakken = Vak.objects.filter(studenten=request.user.id)

        serializer = VakSerializer(vakken, many=True)
        return Response(serializer.data)

    elif request.method == "POST":
        if is_lesgever(request.user):
            serializer = VakSerializer(data=request.data)
            if serializer.is_valid():
                serializer.save()
                return Response(serializer.data, status=status.HTTP_201_CREATED)
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
        return Response(status=status.HTTP_403_FORBIDDEN)


@api_view(["GET", "PUT", "PATCH", "DELETE"])
def vak_detail(request, id, format=None):
    """
    Een view om de gegevens van een specifiek vak op te halen (GET),
    bij te werken (PUT, PATCH) of te verwijderen (DELETE).

    Args:
        id (int): De primaire sleutel van het vak.

    Returns:
        Response: Gegevens van het vak of een foutmelding als het vak niet bestaat of
        als er een ongeautoriseerde toegang is.
    """
    try:
        vak = Vak.objects.get(pk=id)
    except Vak.DoesNotExist:
        return Response(status=status.HTTP_404_NOT_FOUND)

    if request.method == "GET":
        if is_lesgever(request.user) or contains(vak.studenten, request.user):
            serializer = VakSerializer(vak)
            return Response(serializer.data)
        return Response(status=status.HTTP_403_FORBIDDEN)
    if is_lesgever(request.user):
        if request.method in ["PUT", "PATCH"]:
            if request.method == "PUT":
                serializer = VakSerializer(vak, data=request.data)
            else:
                data = request.data.copy()
                if not data.get("studenten"):
                    data.setlist("studenten", vak.studenten.all())
                if not data.get("lesgevers"):
                    data.setlist("lesgevers", vak.lesgevers.all())
                serializer = VakSerializer(vak, data=data, partial=True)
            if serializer.is_valid():
                serializer.save()
                return Response(serializer.data)
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

        elif request.method == "DELETE":
            vak.delete()
            return Response(status=status.HTTP_204_NO_CONTENT)
    return Response(status=status.HTTP_403_FORBIDDEN)
