from django.conf import settings
from django.http import JsonResponse
import requests

ERRORS = {
    'no_perm': 'You do not have permission to view this data',
    'generic': 'There was an error'
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



def json_error(error_code):
    return JsonResponse({'error': {'message': ERRORS.get(error_code, ERRORS['generic'])}})