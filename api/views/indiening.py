from rest_framework.decorators import api_view
from rest_framework.response import Response
from rest_framework import status

from api.models.indiening import Indiening, IndieningBestand
from api.models.groep import Groep
from api.serializers.indiening import IndieningSerializer, IndieningBestandSerializer
from api.utils import is_lesgever, contains


@api_view(["GET", "POST"])
def indiening_list(request, format=None):
    if request.method == 'GET':
        if is_lesgever(request.user):
            indieningen = Indiening.objects.all()
        else:
            groepen = Groep.objects.filter(studenten=request.user.id)
            indieningen = Indiening.objects.filter(groep__in=groepen)

        if "groep" in request.GET:
            try:
                groep = eval(request.GET.get('groep'))
                indieningen = indieningen.filter(groep=groep)
            except NameError:
                return Response(status=status.HTTP_400_BAD_REQUEST)

        serializer = IndieningSerializer(indieningen, many=True)
        return Response(serializer.data)
    
    elif request.method == 'POST':
        if 'indiening_bestanden' not in request.FILES:
            return Response({"indiening_bestanden":["This field is required."]}, status=status.HTTP_400_BAD_REQUEST)
        
        serializer = IndieningSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save()
            indiening = serializer.instance
        else:
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

        for file in request.FILES.getlist('indiening_bestanden'):
            IndieningBestand.objects.create(indiening = indiening, bestand = file)
        return Response(serializer.data, status=status.HTTP_201_CREATED)

    
        
@api_view(['GET', 'DELETE'])
def indiening_detail(request, id, format=None): 
    try:
        indiening = Indiening.objects.get(pk=id)
    except Indiening.DoesNotExist:
        return Response(status=status.HTTP_404_NOT_FOUND)

    if request.method == 'GET':
        if is_lesgever(request.user) or contains(indiening.groep.studenten, request.user):
            serializer = IndieningSerializer(indiening)
            return Response(serializer.data)
        return Response(status=status.HTTP_403_FORBIDDEN)
    
    elif request.method == 'DELETE':
        if is_lesgever(request.user) or contains(indiening.groep.studenten, request.user):
            indiening.delete()
            return Response(status=status.HTTP_204_NO_CONTENT)
        return Response(status=status.HTTP_403_FORBIDDEN)
    


@api_view(['GET'])
def indiening_bestand_list(request, format=None):

    if request.method == 'GET':
        if is_lesgever(request.user):
            indieningen_bestanden = IndieningBestand.objects.all()
        else:
            groepen = Groep.objects.filter(studenten=request.user.id)
            indieningen = Indiening.objects.filter(groep__in=groepen)
            indieningen_bestanden = IndieningBestand.objects.filter(indiening__in=indieningen)


        if "indiening" in request.GET:
            try:
                indiening = eval(request.GET.get('indiening'))
                indieningen_bestanden = indieningen_bestanden.filter(indiening=indiening)
            except NameError:
                return Response(status=status.HTTP_400_BAD_REQUEST)

        serializer = IndieningBestandSerializer(indieningen_bestanden, many=True)
        return Response(serializer.data)


@api_view(['GET'])
def indiening_bestand_detail(request, id, format=None):
    try:
        indiening_bestand = IndieningBestand.objects.get(pk=id)
    except IndieningBestand.DoesNotExist:
        return Response(status=status.HTTP_404_NOT_FOUND)

    if request.method == 'GET':
        if is_lesgever(request.user) or contains(indiening_bestand.indiening.groep.studenten, request.user):
            serializer = IndieningBestandSerializer(indiening_bestand)
            return Response(serializer.data)
        return Response(status=status.HTTP_403_FORBIDDEN)
