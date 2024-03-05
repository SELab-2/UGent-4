from django.conf import settings
from api.models.gebruiker import Gebruiker
from api.serializers.gebruiker import GebruikerSerializer
import requests


API_URLS = {
    'studenten': '/api/studenten',
    'vakken': '/api/vakken',
    'groepen': '/api/groepen',
    'indieningen': '/api/indieningen',
}


def get_graph_token():
    """
        Get graph token from AD url.
    """
    try:
        url = settings.AD_URL

        headers = {'Content-Type': 'application/x-www-form-urlencoded', 'Accept': 'application/json'}

        data = {
            'grant_type': 'client_credentials',
            'client_id': settings.CLIENT_ID,
            'client_secret': settings.CLIENT_SECRET,
            'scope': 'https://graph.microsoft.com/.default',
        }

        response = requests.post(url=url, headers=headers, data=data)
        return response.json()
    except:
        return None


def is_lesgever(id):
    gebruiker = Gebruiker.objects.get(pk=id)
    serializer = GebruikerSerializer(gebruiker)
    return serializer.data['is_lesgever']