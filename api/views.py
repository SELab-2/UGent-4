from django.shortcuts import render
from django.http import HttpResponse

from django.http import JsonResponse
from utils import get_graph_token


def succesfully_logged_in(request):
    """
        Get user details from microsoft graph apis.
    """
    graph_token = get_graph_token()

    return HttpResponse(f"Logged in as {request.user.first_name} {request.user.last_name}, with email: {request.user.username} \nWith token: {graph_token['access_token']}")

def microsoft_association(request):
    return JsonResponse({"associatedApplications": [{ "applicationId": "239ce609-e362-4cf6-919f-97e6935ef5f5" }]})

def main(request):
    return HttpResponse("my http resonse")
