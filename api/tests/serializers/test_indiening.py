from django.test import TestCase
from django.core.files.uploadedfile import SimpleUploadedFile
from api.serializers.indiening import IndieningSerializer, IndieningBestandSerializer
from api.tests.factories.indiening import IndieningFactory, IndieningBestandFactory
from api.tests.factories.groep import GroepFactory


class IndieningSerializerTest(TestCase):
    def setUp(self):
        self.indiening = IndieningFactory.create()
        self.serializer = IndieningSerializer(instance=self.indiening)

    def test_indiening_serializer_fields(self):
        data = self.serializer.data
        self.assertEqual(
            set(data.keys()), set(["indiening_id", "groep", "tijdstip"])
        )

    def test_indiening_serializer_create(self):
        # can't check tijdstip because it's auto_now_add
        groep = GroepFactory.create()
        data = {"groep": groep.groep_id}
        serializer = IndieningSerializer(data=data)
        self.assertTrue(serializer.is_valid())
        indiening = serializer.save()
        self.assertEqual(indiening.groep, groep)

    def test_indiening_serializer_update(self):
        # can't check tijdstip because it's auto_now_add
        new_data = {"groep": self.indiening.groep.groep_id}
        serializer = IndieningSerializer(
            instance=self.indiening, data=new_data, partial=True
        )
        self.assertTrue(serializer.is_valid())
        indiening = serializer.save()
        self.assertEqual(indiening.groep, self.indiening.groep)


class IndieningBestandSerializerTest(TestCase):
    def setUp(self):
        self.indiening_bestand = IndieningBestandFactory.create(
            bestand=SimpleUploadedFile("file.txt", b"file_content")
        )
        self.serializer = IndieningBestandSerializer(instance=self.indiening_bestand)

    def test_indiening_bestand_serializer_fields(self):
        data = self.serializer.data
        self.assertEqual(
            set(data.keys()), set(["indiening_bestand_id", "indiening", "bestand"])
        )

    def test_indiening_bestand_serializer_create(self):
        indiening = IndieningFactory.create()
        data = {
            "indiening": indiening.indiening_id,
            "bestand": SimpleUploadedFile("file.txt", b"file_content"),
        }
        serializer = IndieningBestandSerializer(data=data)
        self.assertTrue(serializer.is_valid())
        indiening_bestand = serializer.save()
        self.assertEqual(indiening_bestand.indiening, indiening)

    def test_indiening_bestand_serializer_update(self):
        new_data = {
            "indiening": self.indiening_bestand.indiening.indiening_id,
            "bestand": SimpleUploadedFile("file.txt", b"file_content"),
        }
        serializer = IndieningBestandSerializer(
            instance=self.indiening_bestand, data=new_data, partial=True
        )
        self.assertTrue(serializer.is_valid())
        indiening_bestand = serializer.save()
        self.assertEqual(indiening_bestand.indiening, self.indiening_bestand.indiening)
