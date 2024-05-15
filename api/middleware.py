from django.conf import settings
from django.shortcuts import redirect
from django.contrib.auth.models import User
from api.models.gebruiker import Gebruiker
from api.serializers.gebruiker import GebruikerSerializer
import requests

URL = "https://graph.microsoft.com/v1.0/me"


class AuthenticationUserMiddleware:
    """
    Middleware voor authenticatie van gebruikers en het aanmaken van gebruikersindeling.

    Args:
        get_response (callable): De volgende middleware in de keten.

    Returns:
        HttpResponse: Een HTTP-response-object.

    Raises:
        Redirect: Redirect naar de inlog-URL als er geen autorisatiegegevens zijn.
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


class DisableCSRFMiddleware(object):

    def __init__(self, get_response):
        self.get_response = get_response

    def __call__(self, request):
        setattr(request, '_dont_enforce_csrf_checks', True)
        response = self.get_response(request)
        return response