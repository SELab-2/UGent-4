from rest_framework.exceptions import ValidationError
from django.test import TestCase
from api.serializers.score import ScoreSerializer
from api.tests.factories.score import ScoreFactory
from api.tests.factories.indiening import IndieningFactory


class ScoreSerializerTest(TestCase):
    def setUp(self):
        self.score = ScoreFactory.create()
        self.score.score = self.score.indiening.groep.project.max_score
        self.score.save()
        self.serializer = ScoreSerializer(instance=self.score)

    def test_score_serializer_fields(self):
        data = self.serializer.data
        self.assertEqual(set(data.keys()), set(["score_id", "indiening", "score"]))

    def test_score_id_field_content(self):
        data = self.serializer.data
        self.assertEqual(data["score_id"], self.score.score_id)

    def test_indiening_field_content(self):
        data = self.serializer.data
        self.assertEqual(data["indiening"], self.score.indiening.indiening_id)

    def test_score_field_content(self):
        data = self.serializer.data
        self.assertEqual(data["score"], self.score.score)

    def test_score_serializer_create(self):
        indiening = IndieningFactory.create()
        max_score = indiening.groep.project.max_score
        data = {"indiening": indiening.indiening_id, "score": max_score}
        serializer = ScoreSerializer(data=data)
        self.assertTrue(serializer.is_valid())
        score = serializer.save()
        self.assertEqual(score.indiening, indiening)
        self.assertEqual(score.score, data["score"])
    
    def test_score_serializer_create_invalid(self):
        indiening = IndieningFactory.create()
        max_score = indiening.groep.project.max_score
        data = {"indiening": indiening.indiening_id, "score": max_score}
        serializer = ScoreSerializer(data=data)
        self.assertTrue(serializer.is_valid())
        score = serializer.save()
        new_data = {"indiening": indiening.indiening_id, "score": max_score}
        new_serializer = ScoreSerializer(data=new_data)
        self.assertTrue(new_serializer.is_valid())
        self.assertRaises(ValidationError, new_serializer.save, raise_exception=True)
    
    def test_score_serializer_create_invalid_high_score(self):
        indiening = IndieningFactory.create()
        max_score = indiening.groep.project.max_score
        data = {"indiening": indiening.indiening_id, "score": max_score + 1}
        serializer = ScoreSerializer(data=data)
        self.assertTrue(serializer.is_valid())
        self.assertRaises(ValidationError, serializer.save, raise_exception=True)

    def test_score_serializer_update(self):
        score = self.score.score
        new_data = {
            "score": score - 1,
            "indiening": self.score.indiening.indiening_id,
            "score_id": self.score.score_id,
        }
        serializer = ScoreSerializer(instance=self.score, data=new_data, partial=True)
        self.assertTrue(serializer.is_valid())
        score = serializer.save()
        self.assertEqual(score.score, new_data["score"])
    
    def test_score_serializer_update_invalid(self):
        indiening = IndieningFactory.create()
        score = self.score.score
        new_data = {
            "score": score,
            "indiening": indiening.indiening_id,
            "score_id": self.score.score_id,
        }
        print(new_data)
        serializer = ScoreSerializer(instance=self.score, data=new_data, partial=True)
        self.assertTrue(serializer.is_valid())
        self.assertRaises(ValidationError, serializer.save, raise_exception=True)


