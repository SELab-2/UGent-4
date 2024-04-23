from rest_framework.decorators import api_view
from rest_framework.response import Response
from rest_framework import status

from api.models.vak import Vak
from api.serializers.vak import VakSerializer
from api.utils import has_permissions, is_lesgever, contains, get_gebruiker


@api_view(["GET", "POST"])
def vak_list(request, format=None):
    """
    Een view om een lijst van vakken op te halen of een nieuw vak toe te voegen.

    GET:
    Geeft alle vakken terug.

    Optionele query parameters:
        in (boolean): Filtert de vakken waarvan de gebruiker deel uitmaakt.
        gearchiveerd (boolean): Toont alleen de gearchiveerde vakken.

    POST:
    Voegt een nieuw vak toe.

    Returns:
        Response: Een lijst van vakken of een nieuw aangemaakt vak.
    """
    if request.method == "GET":
        vakken = Vak.objects.all()
        if "in" in request.GET and request.GET.get("in").lower() == "true":
            if is_lesgever(request.user):
                vakken = vakken.filter(lesgevers=request.user.id)
            else:
                vakken = vakken.filter(studenten=request.user.id)

        if "gearchiveerd" in request.GET and request.GET.get(
            "gearchiveerd"
        ).lower() in ["true", "false"]:
            vakken = vakken.filter(
                gearchiveerd=(request.GET.get("gearchiveerd").lower() == "true")
            )

        serializer = VakSerializer(vakken, many=True)
        return Response(serializer.data)

    elif request.method == "POST":
        if has_permissions(request.user):
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
        serializer = VakSerializer(vak)
        return Response(serializer.data)
    if has_permissions(request.user):
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


@api_view(["GET"])
def vak_detail_accept_invite(request, id, format=None):
    """
    Een view om de invite van een vak te accepteren (GET),

    Args:
        id (int): De primaire sleutel van het vak.

    Returns:
        Response: Gegevens van het vak of een foutmelding als de gebruiker niet geinvite was.
    """
    try:
        vak = Vak.objects.get(pk=id)
    except Vak.DoesNotExist:
        return Response(status=status.HTTP_404_NOT_FOUND)

    gebruiker = get_gebruiker(request.user)

    if contains(vak.invited, request.user):
        if gebruiker.is_lesgever:
            vak.lesgevers.add(gebruiker)
        else:
            vak.studenten.add(gebruiker)
    else:
        return Response(
            status=status.HTTP_403_FORBIDDEN,
            data={"error": "Deze gebruiker is niet geinviteerd voor dit vak"},
        )
