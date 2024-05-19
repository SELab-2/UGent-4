from django.contrib.auth.models import User
from api.models.gebruiker import Gebruiker
from api.serializers.gebruiker import GebruikerSerializer



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
        
        mail = "lesgever@testing.com"
        try:
            user = User.objects.get(username=mail)
        except User.DoesNotExist:
            user = User.objects.create_user(
                username=mail,
                email=mail,
                first_name="Lesgever",
                last_name="Testing",
            )

        request.user = user

        try:
            Gebruiker.objects.get(pk=request.user.id)
        except Gebruiker.DoesNotExist:
            gebruiker_post_data = {
                "user": request.user.id,
                "subjects": [],
                "is_lesgever": True,
            }
            serializer = GebruikerSerializer(data=gebruiker_post_data)
            if serializer.is_valid():
                serializer.save()

        return self.get_response(request)


class DisableCSRFMiddleware(object):

    def __init__(self, get_response):
        self.get_response = get_response

    def __call__(self, request):
        setattr(request, "_dont_enforce_csrf_checks", True)
        response = self.get_response(request)
        return response
