from rest_framework.decorators import api_view
from rest_framework.response import Response
from rest_framework import status

from api.models.gebruiker import Gebruiker
from api.serializers.gebruiker import GebruikerSerializer

from api.utils import is_lesgever


@api_view(["GET"])
def gebruiker_list(request):
    """
    Een view om alle gebruikers op te halen.

    Als de gebruiker een lesgever is, worden alle gebruikers opgehaald.
    Als de gebruiker geen lesgever is, worden alleen de gegevens van de
    ingelogde gebruiker opgehaald.

    Optionele query parameters:
        is_lesgever (bool): Filtert gebruikers op basis van of ze lesgevers zijn of niet.

    Returns:
        Response: Een lijst van gebruikers.
    """

    if is_lesgever(request.user):
        gebruikers = Gebruiker.objects.all()
    else:
        gebruikers = Gebruiker.objects.filter(user=request.user.id)

    if "is_lesgever" in request.GET and request.GET.get("is_lesgever").lower() in [
        "true",
        "false",
    ]:
        gebruikers = gebruikers.filter(
            is_lesgever=(request.GET.get("is_lesgever").lower() == "true")
        )

    serializer = GebruikerSerializer(gebruikers, many=True)
    return Response(serializer.data)


@api_view(["GET", "PUT"])
def gebruiker_detail(request, id):
    """
    Een view om de gegevens van een specifieke gebruiker op te halen (GET) of bij te werken (PUT).

    Args:
        id (int): De primaire sleutel van de gebruiker.

    Returns:
        Response: Gegevens van de gebruiker of een foutmelding als de gebruiker niet
        bestaat of als er een ongeautoriseerde toegang is.
    """
    try:
        gebruiker = Gebruiker.objects.get(pk=id)
    except Gebruiker.DoesNotExist:
        return Response(status=status.HTTP_404_NOT_FOUND)

    if request.method == "GET":
        if is_lesgever(request.user) or int(id) == request.user.id:
            serializer = GebruikerSerializer(gebruiker)
            return Response(serializer.data)
        return Response(status=status.HTTP_403_FORBIDDEN)
    elif request.method == "PUT":
        if request.user.is_superuser:
            serializer = GebruikerSerializer(gebruiker, data=request.data)
            if serializer.is_valid():
                serializer.save()
                return Response(serializer.data)
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
    return Response(status=status.HTTP_403_FORBIDDEN)
