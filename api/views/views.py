from django.http import JsonResponse
from django.shortcuts import redirect
from rest_framework.response import Response
from rest_framework.decorators import api_view
from api.serializers.gebruiker import GebruikerSerializer
from api.utils import API_URLS


def login_redirect(request):

    print(get_graph_token())

    gebruiker_post_data = {
        "user": request.user.id,
        "subjects": [],
        "is_lesgever": False,
    }
    serializer = GebruikerSerializer(data=gebruiker_post_data)
    if serializer.is_valid():
        serializer.save()

    return redirect(home)


@api_view(["GET"])
def home(request):
    return Response(data=API_URLS)


def microsoft_association(request):
    return JsonResponse(
        {
            "associatedApplications": [
                {"applicationId": "239ce609-e362-4cf6-919f-97e6935ef5f5"}
            ]
        }
    )
