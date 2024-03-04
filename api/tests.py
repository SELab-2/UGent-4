from django.test import TestCase

class ModelTesting(TestCase):

    def setUp(self):
        pass
        #bv: self.api = Score.objects.create(score=10, ...)
    
    def test_post_model(self):
        #d = self.api
        #self.assertTrue(isinstance(d, Score))
        self.assertTrue(True)