from rest_framework.response import Response
from rest_framework.decorators import api_view
from api.utils import API_URLS


@api_view(["GET"])
def home(request):
    """
    Een view die de startpagina van de API retourneert.

    Args:
        request (HttpRequest): Het HTTP-verzoek dat naar de view is gestuurd.

    Returns:
        Response: Een HTTP-respons met de URL's van de API.
    """
    return Response(data=API_URLS)
