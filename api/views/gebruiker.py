from rest_framework.decorators import api_view
from rest_framework.response import Response
from rest_framework import status

from api.models.gebruiker import Gebruiker
from api.serializers.gebruiker import GebruikerSerializer




@api_view(['GET', 'POST'])
def gebruiker_list(request):
    if request.method == 'GET':
        gebruikers = Gebruiker.objects.all()
        
        if 'is_lesgever' in request.GET and request.GET.get('is_lesgever').lower() in ['true', 'false']:
            gebruikers = gebruikers.filter(is_lesgever = (request.GET.get('is_lesgever').lower() == 'true'))
        if 'heeft_vak' in request.GET:
            try:
                vak = eval(request.GET.get('heeft_vak'))
                gebruikers = gebruikers.filter(subjects=vak)
            except NameError:
                pass

        serializer = GebruikerSerializer(gebruikers, many=True)
        return Response(serializer.data)

    elif request.method == 'POST':
        serializer = GebruikerSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
        

@api_view(['GET', 'PUT'])
def gebruiker_detail(request, id):
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
    
