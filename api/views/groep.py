from rest_framework.decorators import api_view
from rest_framework.response import Response
from rest_framework import status

from api.models.groep import Groep
from api.serializers.groep import GroepSerializer
from api.utils import is_lesgever, contains


@api_view(['GET', 'POST'])
def groep_list(request, format=None):
    """
    Gives a list of all groepen.

    Args:
        request: A HTTP request.
    """

    if request.method == 'GET':
        if is_lesgever(request.user):
            groepen = Groep.objects.all()
        else:
            groepen = Groep.objects.filter(studenten=request.user.id)

        if "project" in request.GET:
            try:
                project = eval(request.GET.get('project'))
                groepen = groepen.filter(project=project)
            except NameError:
                return Response(status=status.HTTP_400_BAD_REQUEST)

        if "student" in request.GET:
            try:
                student = eval(request.GET.get('student'))
                groepen = groepen.filter(studenten=student)
            except NameError:
                return Response(status=status.HTTP_400_BAD_REQUEST)


        serializer = GroepSerializer(groepen, many=True)
        return Response(serializer.data)


    elif request.method == 'POST':
        if is_lesgever(request.user):
            serializer = GroepSerializer(data=request.data)
            if serializer.is_valid():
                serializer.save()
                return Response(serializer.data, status=status.HTTP_201_CREATED)
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
        return Response(status=status.HTTP_403_FORBIDDEN)
@api_view(['GET', 'PUT', 'DELETE'])
def groep_detail(request, id, format=None):
    """
    Gives the groep with a certain id.

    Args:
        request: A HTTP request.
        id: ID of the gebruiker.
    """
    try:
        groep = Groep.objects.get(pk=id)
    except Groep.DoesNotExist:
        return Response(status=status.HTTP_404_NOT_FOUND)
    if request.method == 'GET':
        if is_lesgever(request.user) or contains(groep.studenten, request.user):
            serializer = GroepSerializer(groep)
            return Response(serializer.data)
        return Response(status=status.HTTP_403_FORBIDDEN)
    
    if is_lesgever(request.user):
        if request.method == 'PUT':
            serializer = GroepSerializer(groep, data=request.data)
            if serializer.is_valid():
                serializer.save()
                return Response(serializer.data)
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
        
        elif request.method == 'DELETE':
            groep.delete()
            return Response(status=status.HTTP_204_NO_CONTENT)
    return Response(status=status.HTTP_403_FORBIDDEN)
