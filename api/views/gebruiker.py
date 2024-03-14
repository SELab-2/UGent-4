from rest_framework.decorators import api_view
from rest_framework.response import Response
from rest_framework import status

from api.models.gebruiker import Gebruiker
from api.serializers.gebruiker import GebruikerSerializer




@api_view(['GET'])
def gebruiker_list(request):
    """
    Gives a list of all gebruikers.
    If the query 'is_lesgever' is in the GET request with arguement true or false,
    it filters on only the gebruikers for which is_lesgever matches it.

    Args:
        request: A HTTP request.
    """
    if request.method == 'GET':
        gebruikers = Gebruiker.objects.all()

        if 'is_lesgever' in request.GET and request.GET.get('is_lesgever').lower() in ['true', 'false']:
            gebruikers = gebruikers.filter(is_lesgever = (request.GET.get('is_lesgever').lower() == 'true'))


        serializer = GebruikerSerializer(gebruikers, many=True)
        return Response(serializer.data)


@api_view(['GET', 'PUT'])
def gebruiker_detail(request, id):
    """
    Gives the gebruiker with a certain id.

    Args:
        request: A HTTP request.
        id: ID of the gebruiker.
    """
    try:
        gebruiker = Gebruiker.objects.get(pk=id)
    except Gebruiker.DoesNotExist:
        return Response(status=status.HTTP_404_NOT_FOUND)

    if request.method == 'GET':
        serializer = GebruikerSerializer(gebruiker)
        return Response(serializer.data)
    if request.method == 'PUT':
        serializer = GebruikerSerializer(gebruiker, data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
