from django.http import JsonResponse, HttpResponse
from api.utils import get_graph_token
from django.shortcuts import redirect


def login_redirect(request):
    """
        Get user details from microsoft graph apis.
    """
    graph_token = get_graph_token()

    return HttpResponse(f"Logged in as {request.user.first_name} {request.user.last_name}, with email: {request.user.username} \nWith token: {graph_token['access_token']}")

    return redirect("https://sel2-4.ugent.be")

def microsoft_association(request):
    return JsonResponse({"associatedApplications": [{ "applicationId": "239ce609-e362-4cf6-919f-97e6935ef5f5" }]})