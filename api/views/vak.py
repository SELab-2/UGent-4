from rest_framework.decorators import api_view
from rest_framework.response import Response
from rest_framework import status
from api.models.vak import Vak
from api.serializers.vak import VakSerializer


@api_view(['GET', 'POST'])
def vak_list(request):
    if request.method == 'GET':
        lesgevers = Vak.objects.all()
        serializer = VakSerializer(lesgevers, many=True)
        return Response(serializer.data)
    elif request.method == 'POST':
        serializer = VakSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

"""

@api_view(['GET', 'PUT'])
def vak_detail(request, id):
    try:
        student = Vak.objects.get(pk=id)
    except Vak.DoesNotExist:
        return Response(status=status.HTTP_404_NOT_FOUND)

    if request.method == 'GET':
        serializer = StudentSerializer(student)
        return Response(serializer.data)
    elif request.method == 'PUT':
        serializer = StudentSerializer(student, data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
        """