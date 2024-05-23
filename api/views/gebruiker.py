from rest_framework.decorators import api_view
from rest_framework.response import Response
from rest_framework import status

from django.contrib.auth.models import User
from api.models.gebruiker import Gebruiker
from api.serializers.gebruiker import GebruikerSerializer

from api.utils import has_permissions


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

    gebruikers = Gebruiker.objects.all()

    if "is_lesgever" in request.GET and request.GET.get("is_lesgever").lower() in [
        "true",
        "false",
    ]:
        gebruikers = gebruikers.filter(
            is_lesgever=(request.GET.get("is_lesgever").lower() == "true")
        )

    if "email" in request.GET:
        users = User.objects.filter(email__iexact=request.GET.get("email"))
        gebruikers = gebruikers.filter(user__in=users)

    serializer = GebruikerSerializer(gebruikers, many=True)
    return Response(serializer.data)


@api_view(["GET", "PUT", "PATCH"])
def gebruiker_detail(request, id):
    """
    Een view om de gegevens van een specifieke gebruiker op te halen (GET) of bij te werken (PUT, PATCH).

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
        serializer = GebruikerSerializer(gebruiker)
        return Response(serializer.data)
    elif request.method in ["PUT", "PATCH"]:
        if has_permissions(request.user) or request.user.id == id:
            if request.method == "PUT":
                serializer = GebruikerSerializer(gebruiker, data=request.data)
            else:
                serializer = GebruikerSerializer(
                    gebruiker, data=request.data, partial=True
                )
            if serializer.is_valid():
                serializer.save()
                return Response(serializer.data)
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
    return Response(status=status.HTTP_403_FORBIDDEN)


@api_view(["GET"])
def gebruiker_detail_me(request):
    """
    Een view om de gegevens van de huidige gebruiker op te halen (GET).

    Returns:
        Response: Gegevens van de gebruiker.
    """

    gebruiker = Gebruiker.objects.get(pk=request.user.id)

    serializer = GebruikerSerializer(gebruiker)
    return Response(serializer.data)
