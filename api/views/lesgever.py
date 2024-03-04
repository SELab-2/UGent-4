from django.http import JsonResponse
from rest_framework.decorators import api_view
from rest_framework.response import Response
from rest_framework import status
from api.models.lesgever import Lesgever
from api.serializers.lesgever import LesgeverSerializer


@api_view(['GET', 'POST'])
def lesgever_list(request):
    if request.method == 'GET':
        lesgevers = Lesgever.objects.all()
        serializer = LesgeverSerializer(lesgevers, many=True)
        return JsonResponse({'lesgevers': serializer.data})
    elif request.method == 'POST':
        serializer = LesgeverSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_201_CREATED)
