from rest_framework.decorators import api_view
from rest_framework.response import Response
from rest_framework import status

from api.models.score import Score
from api.models.groep import Groep
from api.models.indiening import Indiening
from api.serializers.score import ScoreSerializer
from api.utils import is_lesgever, contains


@api_view(["GET", "POST"])
def score_list(request, format=None):
    """
    Een view om een lijst van scores op te halen of een nieuwe score toe te voegen.

    GET:
    Als de gebruiker een lesgever is, worden alle scores opgehaald.
    Als de gebruiker geen lesgever is,
    worden alleen de scores opgehaald van indieningen van groepen waarin
    de ingelogde gebruiker zich bevindt.

    Optionele query parameters:
        indiening (int): Filtert scores op basis van indiening-ID.

    POST:
    Voegt een nieuwe score toe.

    Returns:
        Response: Een lijst van scores of een nieuwe aangemaakte score.
    """
    if request.method == "GET":
        if is_lesgever(request.user):
            scores = Score.objects.all()
        else:
            groepen = Groep.objects.filter(studenten=request.user.id)
            indieningen = Indiening.objects.filter(groep__in=groepen)
            scores = Score.objects.filter(indiening__in=indieningen)

        if "indiening" in request.GET:
            try:
                indiening = eval(request.GET.get("indiening"))
                scores = scores.filter(indiening=indiening)
            except NameError:
                return Response(status=status.HTTP_400_BAD_REQUEST)

        serializer = ScoreSerializer(scores, many=True)
        return Response(serializer.data)

    elif request.method == "POST":
        if is_lesgever(request.user):
            serializer = ScoreSerializer(data=request.data)
            if serializer.is_valid():
                serializer.save()
                return Response(serializer.data, status=status.HTTP_201_CREATED)
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
        return Response(status=status.HTTP_403_FORBIDDEN)


@api_view(["GET", "PUT", "PATCH", "DELETE"])
def score_detail(request, id, format=None):
    """
    Een view om de gegevens van een specifieke score op te halen (GET),
    bij te werken (PUT, PATCH) of te verwijderen (DELETE).

    Args:
        id (int): De primaire sleutel van de score.

    Returns:
        Response: Gegevens van de score of een foutmelding als
        de score niet bestaat of als er een ongeautoriseerde toegang is.
    """
    try:
        score = Score.objects.get(pk=id)
    except Score.DoesNotExist:
        return Response(status=status.HTTP_404_NOT_FOUND)

    if request.method == "GET":
        if is_lesgever(request.user) or contains(
            score.indiening.groep.studenten, request.user
        ):
            serializer = ScoreSerializer(score)
            return Response(serializer.data)
        return Response(status=status.HTTP_403_FORBIDDEN)

    if is_lesgever(request.user):
        if request.method in ["PUT", "PATCH"]:
            if request.method == "PUT":
                serializer = ScoreSerializer(score, data=request.data)
            else:
                serializer = ScoreSerializer(score, data=request.data, partial=True)
            if serializer.is_valid():
                serializer.save()
                return Response(serializer.data)
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

        elif request.method == "DELETE":
            score.delete()
            return Response(status=status.HTTP_204_NO_CONTENT)
    return Response(status=status.HTTP_403_FORBIDDEN)
