from django.conf import settings
from django.shortcuts import redirect
from django.urls import reverse


class RedirectAnonymousUserMiddleware:
    def __init__(self, get_response):
        self.get_response = get_response

    def __call__(self, request):
        # Check if the user is anonymous and the current path is not the login page
        if request.user.is_anonymous and request.path not in [
            "/oauth2/login",
            "/oauth2/callback",
        ]:
            # Redirect to the login page
            return redirect(settings.LOGIN_URL)

        return self.get_response(request)
