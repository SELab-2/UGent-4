from django.conf import settings
import requests


API_URLS = {
    'gebruikers': '/api/gebruikers',
    'vakken': '/api/vakken',
    'groepen': '/api/groepen',
    'indieningen': '/api/indieningen',
    'scores': 'api/scores'
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
