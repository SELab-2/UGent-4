from django.conf import settings
from django.shortcuts import redirect
from django.contrib.auth.models import User
from api.models.gebruiker import Gebruiker
from api.serializers.gebruiker import GebruikerSerializer
import requests

URL = "https://graph.microsoft.com/v1.0/me"


class AuthenticationUserMiddleware:
    """
    Middleware die anonieme gebruikers omleidt naar de inlogpagina.
    Deze middleware controleert of de gebruiker anoniem is en of het huidige pad niet de inlogpagina is.
    Als dit het geval is, wordt de gebruiker omgeleid naar de inlogpagina die is geconfigureerd in de instellingen.

    Args:
        get_response (function): De functie die wordt aangeroepen om het verzoek te verwerken.

    Returns:
        HttpResponse: Een HTTP-omleiding naar de inlogpagina als de gebruiker anoniem is
        en het huidige pad niet de inlogpagina is.
                      Anders wordt het verzoek verder verwerkt door de volgende middleware of de weergavefunctie.
    """

    def __init__(self, get_response):
        self.get_response = get_response

    def __call__(self, request):
        if request.path in ["/oauth2/login", "/oauth2/callback"]:
            return self.get_response(request)

        if request.user.is_anonymous:
            authorization = request.headers.get("Authorization")
            if authorization:
                headers = {
                    "Authorization": authorization,
                    "Content-Type": "application/json",
                }

                response = requests.get(url=URL, headers=headers)
                json_data = response.json()
                mail = json_data.get("mail")
                first_name = json_data.get("givenName")
                last_name = json_data.get("surname")
                try:
                    user = User.objects.get(username=mail)
                except User.DoesNotExist:
                    user = User.objects.create_user(
                        username=mail,
                        email=mail,
                        first_name=first_name,
                        last_name=last_name,
                    )

                request.user = user
            else:
                return redirect(settings.LOGIN_URL)

        try:
            Gebruiker.objects.get(pk=request.user.id)
        except Gebruiker.DoesNotExist:
            gebruiker_post_data = {
                "user": request.user.id,
                "subjects": [],
                "is_lesgever": False,
            }
            serializer = GebruikerSerializer(data=gebruiker_post_data)
            if serializer.is_valid():
                serializer.save()

        return self.get_response(request)
