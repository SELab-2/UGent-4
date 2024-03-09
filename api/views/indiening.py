from rest_framework.decorators import api_view
from rest_framework.response import Response
from rest_framework import status

from api.models.indiening import Indiening
from api.serializers.indiening import IndieningSerializer


@api_view(['GET', 'POST'])
def indiening_list(request, format=None):

    if request.method == 'GET':
        indieningen = Indiening.objects.all()

        if "project" in request.GET:
            try:
                project = eval(request.GET.get('project'))
                indieningen = indieningen.filter(project=project)
            except NameError:
                return Response(status=status.HTTP_400_BAD_REQUEST)
            
        if "groep" in request.GET:
            try:
                groep = eval(request.GET.get('groep'))
                indieningen = indieningen.filter(indiener=groep)
            except NameError:
                return Response(status=status.HTTP_400_BAD_REQUEST)

        serializer = IndieningSerializer(indieningen, many=True)
        return Response(serializer.data)
    
    elif request.method == 'POST':
        serializer = IndieningSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
        
@api_view(['GET', 'PUT', 'DELETE'])
def indiening_detail(request, id, format=None): 
    try:
        indiening = Indiening.objects.get(pk=id)
    except Indiening.DoesNotExist:
        return Response(status=status.HTTP_404_NOT_FOUND)

    if request.method == 'GET':
        serializer = IndieningSerializer(indiening)
        return Response(serializer.data)
    
    elif request.method == 'PUT':
        serializer = IndieningSerializer(indiening, data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
    
    elif request.method == 'DELETE':
        indiening.delete()
        return Response(status=status.HTTP_204_NO_CONTENT)
