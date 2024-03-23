from rest_framework.decorators import api_view
from rest_framework.response import Response
from rest_framework import status

from api.models.restrictie import Restrictie
from api.serializers.restrictie import RestrictieSerializer
from api.utils import is_lesgever


@api_view(["GET", "POST"])
def restrictie_list(request, format=None):
    """
    TODO
    """
    if is_lesgever(request.user):
        if request.method == "GET":
            restricties = Restrictie.objects.all()

            if "project" in request.GET:
                try:
                    project = eval(request.GET.get("project"))
                    restricties = restricties.filter(project = project)
                except NameError:
                    return Response(status=status.HTTP_400_BAD_REQUEST)

            if "moet_slagen" in request.GET and request.GET.get("moet_slagen").lower() in [
                "true",
                "false",
            ]:
                restricties = restricties.filter(
                    moet_slagen=(request.GET.get("moet_slagen").lower() == "true")
                )

            serializer = RestrictieSerializer(restricties, many=True)
            return Response(serializer.data)

        elif request.method == "POST":
            serializer = RestrictieSerializer(data=request.data)
            if serializer.is_valid():
                serializer.save()
                return Response(serializer.data, status=status.HTTP_201_CREATED)
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
    
    return Response(status=status.HTTP_403_FORBIDDEN)


@api_view(["GET", "PUT", "DELETE"])
def restrictie_detail(request, id, format=None):
    """
    TODO
    """
    try:
        restrictie = Restrictie.objects.get(pk=id)
    except Restrictie.DoesNotExist:
        return Response(status=status.HTTP_404_NOT_FOUND)

    if is_lesgever(request.user):
        if request.method == "GET":
            serializer = RestrictieSerializer(restrictie)
            return Response(serializer.data)

        if request.method == "PUT":
            serializer = RestrictieSerializer(restrictie, data=request.data)
            if serializer.is_valid():
                serializer.save()
                return Response(serializer.data)
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

        elif request.method == "DELETE":
            restrictie.delete()
            return Response(status=status.HTTP_204_NO_CONTENT)
    return Response(status=status.HTTP_403_FORBIDDEN)