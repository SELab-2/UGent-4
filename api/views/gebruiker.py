from rest_framework.decorators import api_view
from rest_framework.response import Response
from rest_framework import status

from api.models.gebruiker import Gebruiker
from api.serializers.gebruiker import GebruikerSerializer

from api.utils import is_lesgever




@api_view(['GET'])
def gebruiker_list(request):
    if request.method == 'GET':
        if is_lesgever(request.user):
            gebruikers = Gebruiker.objects.all()
        else:
            gebruikers = Gebruiker.objects.filter(user=request.user.id)
        
        if 'is_lesgever' in request.GET and request.GET.get('is_lesgever').lower() in ['true', 'false']:
            gebruikers = gebruikers.filter(is_lesgever = (request.GET.get('is_lesgever').lower() == 'true'))


        serializer = GebruikerSerializer(gebruikers, many=True)
        return Response(serializer.data)
    return Response(status=status.HTTP_403_FORBIDDEN)
        

@api_view(['GET', 'PUT'])
def gebruiker_detail(request, id):
    try:
        gebruiker = Gebruiker.objects.get(pk=id)
    except Gebruiker.DoesNotExist:
        return Response(status=status.HTTP_404_NOT_FOUND)

    if request.method == 'GET':
        if is_lesgever(request.user) or id == request.user.id:
            serializer = GebruikerSerializer(gebruiker)
            return Response(serializer.data)
        return Response(status=status.HTTP_403_FORBIDDEN)
    elif request.method == 'PUT':
        if request.user.is_superuser:
            serializer = GebruikerSerializer(gebruiker, data=request.data)
            if serializer.is_valid():
                serializer.save()
                return Response(serializer.data)
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
        return Response(status=status.HTTP_403_FORBIDDEN)
    


    
