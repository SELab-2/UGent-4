from django.test import TestCase, RequestFactory
from django.contrib.auth.models import User
from unittest.mock import patch
from api.models.gebruiker import Gebruiker
from api.serializers.gebruiker import GebruikerSerializer
from api.middleware import AuthenticationUserMiddleware
from django.contrib.auth.models import AnonymousUser
import jwt

def create_mock_token():
    payload = {
        "mail": "test@email.com",
        "givenName": "test",
        "surname": "example"
    }
    secret = 'secret'  # Use your own secret key
    token = jwt.encode(payload, secret, algorithm='HS256')
    return token


class AuthenticationUserMiddlewareTest(TestCase):
    def setUp(self):
        self.factory = RequestFactory()
        self.middleware = AuthenticationUserMiddleware(lambda req: None)

    def test_middleware_creates_user(self):
        request = self.factory.get('/')
        request.user = User.objects.create_user('existinguser', 'existing@example.com', 'testpassword')
        request.headers = {'Authorization': 'Bearer testtoken'}

        self.middleware(request)

        user = User.objects.get(username='existinguser')
        self.assertIsNotNone(user)

        gebruiker = Gebruiker.objects.get(user=user)
        self.assertIsNotNone(gebruiker)

    def test_middleware_does_not_redirect_for_oauth2_urls(self):
        # Create a request
        request = self.factory.get('/oauth2/login')
        request.user = AnonymousUser()

        # Call the middleware
        response = self.middleware(request)

        # Check that the middleware did not redirect
        self.assertIsNone(response)
    

    def test_middleware_anonymous_user(self):
        request = self.factory.get('/')
        request.user = AnonymousUser()
        
        response = self.middleware(request)
        self.assertIsNotNone(response)
    

    def test_middleware_no_authorization(self):
        with patch('requests.get') as mock_get:
            mock_get.return_value.json.return_value = {
                "mail": "test@email.com",
                "givenName": "test",
                "surname": "example"
            }
            request = self.factory.get('/')
            request.user = AnonymousUser()
            request.META['HTTP_AUTHORIZATION'] = f"Bearer {create_mock_token()}"
            self.middleware(request)
            user = User.objects.filter(username="test@email.com").exists()
            self.assertTrue(user)
