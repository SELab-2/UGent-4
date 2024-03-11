from rest_framework.decorators import api_view
from rest_framework.response import Response
from rest_framework import status

from api.models.vak import Vak
from api.serializers.vak import VakSerializer

from django.core.exceptions import ValidationError


@api_view(["GET", "POST"])
def vak_list(request, format=None):

    if request.method == "GET":
        lesgevers = Vak.objects.all()
        serializer = VakSerializer(lesgevers, many=True)
        return Response(serializer.data)

    elif request.method == "POST":
        try:
            serializer = VakSerializer(data=request.data)
            if serializer.is_valid():
                serializer.save()
                return Response(serializer.data, status=status.HTTP_201_CREATED)
        except ValidationError as e:
            return Response({"error": e}, status=status.HTTP_400_BAD_REQUEST)


@api_view(["GET", "PUT", "DELETE"])
def vak_detail(request, id, format=None):
    try:
        vak = Vak.objects.get(pk=id)
    except Vak.DoesNotExist:
        return Response(status=status.HTTP_404_NOT_FOUND)

    if request.method == "GET":
        serializer = VakSerializer(vak)
        return Response(serializer.data)

    elif request.method == "PUT":
        try:
            serializer = VakSerializer(vak, data=request.data)
            if serializer.is_valid():
                serializer.save()
                return Response(serializer.data)
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
        except ValidationError as e:
            return Response({"error": e}, status=status.HTTP_400_BAD_REQUEST)

    elif request.method == "DELETE":
        vak.delete()
        return Response(status=status.HTTP_204_NO_CONTENT)
