from rest_framework.decorators import api_view
from rest_framework.response import Response
from rest_framework import status

from api.models.template import Template
from api.serializers.template import TemplateSerializer
from api.utils import has_permissions


@api_view(["GET", "POST"])
def template_list(request, format=None):
    """
    Een view om een lijst van templates op te halen of een nieuwe template toe te voegen.

    GET:
    Als de gebruiker een lesgever is, worden alle templates opgehaald.

    Optionele query parameters:
        lesgever_id (int): Filtert templates op basis van lesgevers

    POST:
    Voegt een nieuwe template toe.

    Returns:
        Response: Een lijst van tempaltes of een nieuw aangemaakte template.
    """
    if request.method == "GET":
        if has_permissions(request.user):
            templates = Template.objects.all()

            if "lesgever_id" in request.GET:
                try:
                    user = eval(request.GET.get("lesgever_id"))
                    templates = templates.filter(user=user)
                except NameError:
                    return Response(status=status.HTTP_400_BAD_REQUEST)

            serializer = TemplateSerializer(templates, many=True)
            return Response(serializer.data)

    elif request.method == "POST":
        if has_permissions(request.user):
            serializer = TemplateSerializer(data=request.data)
            if serializer.is_valid():
                serializer.save()
                return Response(serializer.data, status=status.HTTP_201_CREATED)
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
        return Response(status=status.HTTP_403_FORBIDDEN)


@api_view(["GET", "PUT", "PATCH", "DELETE"])
def template_detail(request, id, format=None):
    """
    Een view om de gegevens van een specifieke template op te halen (GET),
    bij te werken (PUT, PATCH) of te verwijderen (DELETE).

    Args:
        id (int): De primaire sleutel van de template.

    Returns:
        Response: Gegevens van de template of een foutmelding als de template niet
        bestaat of als er een ongeautoriseerde toegang is.
    """
    try:
        template = Template.objects.get(pk=id)
    except Template.DoesNotExist:
        return Response(status=status.HTTP_404_NOT_FOUND)

    if has_permissions(request.user):
        if request.method == "GET":
            serializer = TemplateSerializer(template)
            return Response(serializer.data)
        if request.method in ["PUT", "PATCH"]:
            if request.method == "PUT":
                serializer = TemplateSerializer(template, data=request.data)
            else:
                serializer = TemplateSerializer(
                    template, data=request.data, partial=True
                )
            if serializer.is_valid():
                serializer.save()
                return Response(serializer.data)
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

        elif request.method == "DELETE":
            template.delete()
            return Response(status=status.HTTP_204_NO_CONTENT)
    return Response(status=status.HTTP_403_FORBIDDEN)
