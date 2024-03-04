from django.test import TestCase
from .models import Dummy

class TestModels(TestCase):

    def setUp(self):
        self.dummy1 = Dummy.objects.create(
            name='Dummy 1',
            budget=10000
        )
    
    def test_dummy_model(self):
        self.assertEquals(self.dummy1.slug, 'dummy-1')
        #self.assertTrue(isinstance(d, Score))
        #self.assertTrue(True)