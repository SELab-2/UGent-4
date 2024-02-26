from django.shortcuts import render
from django.http import HttpResponse

from django.http import JsonResponse
from django.conf import settings

import requests

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

        print('hallo')
        response = requests.post(url=url, headers=headers, data=data)
        print(response)
        return response.json()
    except:
        return None




def succesfully_logged_in(request):
    """
        Get user details from microsoft graph apis.
    """
    graph_token = get_graph_token()
    print(graph_token)
    """if graph_token:
        url = 'https://graph.microsoft.com/v1.0/users/' + request.user.username

        headers = {
            'Authorization': 'Bearer ' + graph_token
        }"""
    return HttpResponse("Logged in!")

def microsoft_association(request):
    return JsonResponse({"associatedApplications": [{ "applicationId": "239ce609-e362-4cf6-919f-97e6935ef5f5" }]})

def main(request):
    return HttpResponse("my http resonse")
