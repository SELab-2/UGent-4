from django.test import TestCase
from django.core.files.uploadedfile import SimpleUploadedFile
from api.serializers.indiening import IndieningSerializer
from api.tests.factories.indiening import IndieningFactory
from api.tests.factories.groep import GroepFactory
from unittest.mock import patch


class IndieningSerializerTest(TestCase):
    @patch("api.models.indiening.send_indiening_confirmation_mail")
    def test_indiening_serializer_fields(self, mock_send_mail):
        indiening = IndieningFactory.create()
        self.serializer = IndieningSerializer(instance=indiening)
        data = self.serializer.data
        self.assertEqual(
            set(data.keys()),
            set(
                [
                    "indiening_id",
                    "groep",
                    "tijdstip",
                    "status",
                    "result",
                    "artefacten",
                    "bestand",
                ]
            ),
        )

    @patch("api.models.indiening.send_indiening_confirmation_mail")
    def test_indiening_serializer_create(self, mock_send_mail):
        groep = GroepFactory.create()
        data = {
            "groep": groep.groep_id,
            "bestand": SimpleUploadedFile("bestand.txt", b"bestand_content"),
        }
        serializer = IndieningSerializer(data=data)
        self.assertTrue(serializer.is_valid())
        indiening = serializer.save()
        self.assertEqual(indiening.groep, groep)

    def test_indiening_serializer_no_file(self):
        groep = GroepFactory.create()
        data = {"groep": groep.groep_id}
        serializer = IndieningSerializer(data=data)
        self.assertFalse(serializer.is_valid())

    @patch("api.models.indiening.send_indiening_confirmation_mail")
    def test_indiening_serializer_no_groep(self, mock_send_mail):
        data = {"bestand": SimpleUploadedFile("bestand.txt", b"bestand_content")}
        serializer = IndieningSerializer(data=data)
        self.assertFalse(serializer.is_valid())

    @patch("api.models.indiening.send_indiening_confirmation_mail")
    def test_indiening_serializer_update(self, mock_send_mail):
        indiening = IndieningFactory.create()
        new_data = {"groep": indiening.groep.groep_id}
        serializer = IndieningSerializer(
            instance=indiening, data=new_data, partial=True
        )
        self.assertTrue(serializer.is_valid())
        indiening = serializer.save()
        self.assertEqual(indiening.groep, indiening.groep)
