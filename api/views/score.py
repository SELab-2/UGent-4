from rest_framework.decorators import api_view
from rest_framework.response import Response
from rest_framework import status

from api.models.score import Score
from api.serializers.score import ScoreSerializer


@api_view(['GET', 'POST'])
def score_list(request, format=None):
    """
    Gives a list of all scores.
    If the query 'indiening' is in the GET request,
    it filters on only the indieningen for with matching indiening id.

    Args:
        request: A HTTP request.
    """

    if request.method == 'GET':
        scores = Score.objects.all()

        if "indiening" in request.GET:
            try:
                indiening = eval(request.GET.get('indiening'))
                scores = scores.filter(indiening=indiening)
            except NameError:
                return Response(status=status.HTTP_400_BAD_REQUEST)

        serializer = ScoreSerializer(scores, many=True)
        return Response(serializer.data)

    elif request.method == 'POST':
        serializer = ScoreSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

@api_view(['GET', 'PUT', 'DELETE'])
def score_detail(request, id, format=None):
    """
    Gives the score with a certain id.

    Args:
        request: A HTTP request.
        id: ID of the gebruiker.
    """
    try:
        score = Score.objects.get(pk=id)
    except Score.DoesNotExist:
        return Response(status=status.HTTP_404_NOT_FOUND)

    if request.method == 'GET':
        serializer = ScoreSerializer(score)
        return Response(serializer.data)

    elif request.method == 'PUT':
        serializer = ScoreSerializer(score, data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    elif request.method == 'DELETE':
        score.delete()
        return Response(status=status.HTTP_204_NO_CONTENT)
