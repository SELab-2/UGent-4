from django.conf import settings
from api.models.gebruiker import Gebruiker
import requests


API_URLS = {
    "gebruikers": "/api/gebruikers",
    "vakken": "/api/vakken",
    "groepen": "/api/groepen",
    "indieningen": "/api/indieningen",
    "indiening_bestanden": "/api/indiening_bestanden",
    "scores": "api/scores",
    "projecten": "api/projecten",
}


def get_graph_token():
    """
    Get graph token from AD url.
    """
    try:
        url = settings.AD_URL

        headers = {
            "Content-Type": "application/x-www-form-urlencoded",
            "Accept": "application/json",
        }

        data = {
            "grant_type": "client_credentials",
            "client_id": settings.CLIENT_ID,
            "client_secret": settings.CLIENT_SECRET,
            "scope": "https://graph.microsoft.com/.default",
        }

        response = requests.post(url=url, headers=headers, data=data)
        return response.json()
    except Exception:
        return None


def is_lesgever(user):
    """
    Controleert of de gebruiker een lesgever is.

    Args:
        user (User): De gebruiker waarvan moet worden gecontroleerd of deze een lesgever is.

    Returns:
        bool: True als de gebruiker een lesgever is, anders False.
    """
    if user.is_superuser:
        return True
    gebruiker = Gebruiker.objects.get(pk=user.id)
    return gebruiker.is_lesgever


def contains(lijst, user):
    """
    Controleert of de gebruiker aanwezig is in de gegeven lijst.

    Args:
        lijst (QuerySet): De lijst waarin moet worden gecontroleerd.
        user (User): De gebruiker waarvan moet worden gecontroleerd of deze aanwezig is in de lijst.

    Returns:
        bool: True als de gebruiker aanwezig is in de lijst, anders False.
    """
    gebruiker = Gebruiker.objects.get(pk=user.id)
    return lijst.all().contains(gebruiker)


def get_gebruiker(user):
    """
    Haalt de Gebruiker-instantie op voor de gegeven gebruiker.

    Args:
        user (User): De gebruiker waarvoor de Gebruiker-instantie moet worden opgehaald.

    Returns:
        Gebruiker: De Gebruiker-instantie voor de gegeven gebruiker.
    """
    return Gebruiker.objects.get(pk=user.id)
