from django.conf import settings
from django.shortcuts import redirect
from django.urls import reverse

class RedirectAnonymousUserMiddleware:
    """
    Middleware die anonieme gebruikers omleidt naar de inlogpagina.
    Deze middleware controleert of de gebruiker anoniem is en of het huidige pad niet de inlogpagina is.
    Als dit het geval is, wordt de gebruiker omgeleid naar de inlogpagina die is geconfigureerd in de instellingen.

    Args:
        get_response (function): De functie die wordt aangeroepen om het verzoek te verwerken.

    Returns:
        HttpResponse: Een HTTP-omleiding naar de inlogpagina als de gebruiker anoniem is en het huidige pad niet de inlogpagina is.
                      Anders wordt het verzoek verder verwerkt door de volgende middleware of de weergavefunctie.
    """
    def __init__(self, get_response):
        self.get_response = get_response

    def __call__(self, request):
        # Check if the user is anonymous and the current path is not the login page
        if request.user.is_anonymous and request.path not in ['/oauth2/login', '/oauth2/callback']:
            # Redirect to the login page
            return redirect(settings.LOGIN_URL)

        return self.get_response(request)