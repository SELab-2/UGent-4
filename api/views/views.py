from django.shortcuts import redirect
from rest_framework.response import Response
from rest_framework.decorators import api_view
from api.serializers.gebruiker import GebruikerSerializer
from api.utils import API_URLS


def login_redirect(request):
    """
    Een view die wordt gebruikt voor het verwerken van een login redirect.
    Deze view controleert of de gebruiker is ingelogd, en maakt vervolgens een
    nieuwe gebruiker aan in het systeem voor de ingelogde gebruiker,
    indien deze nog niet bestaat.

    Args:
        request (HttpRequest): Het HTTP-verzoek dat naar de view is gestuurd.

    Returns:
        HttpResponseRedirect: Een HTTP-verzoek naar de startpagina na het verwerken van de login-redirect.
    """

    gebruiker_post_data = {
        "user": request.user.id,
        "subjects": [],
        "is_lesgever": False,
    }
    serializer = GebruikerSerializer(data=gebruiker_post_data)
    if serializer.is_valid():
        serializer.save()

    return redirect(home)


@api_view(["GET"])
def home(request):
    """
    Een view die de startpagina van de API retourneert.

    Args:
        request (HttpRequest): Het HTTP-verzoek dat naar de view is gestuurd.

    Returns:
        Response: Een HTTP-respons met de URL's van de API.
    """
    return Response(data=API_URLS)
