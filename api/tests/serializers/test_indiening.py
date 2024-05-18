from django.test import TestCase
from django.core.files.uploadedfile import SimpleUploadedFile
from api.serializers.indiening import IndieningSerializer
from api.tests.factories.indiening import IndieningFactory
from api.tests.factories.groep import GroepFactory
from api.tests.factories.restrictie import RestrictieFactory


class IndieningSerializerTest(TestCase):

    def test_indiening_serializer_fields(self):
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

    def test_indiening_serializer_create(self):
        groep = GroepFactory.create()
        data = {"groep": groep.groep_id}
        serializer = IndieningSerializer(data=data)
        self.assertTrue(serializer.is_valid())
        indiening = serializer.save()
        self.assertEqual(indiening.groep, groep)

    def test_indiening_serializer_update(self):
        indiening = IndieningFactory.create()
        new_data = {"groep": indiening.groep.groep_id}
        serializer = IndieningSerializer(
            instance=indiening, data=new_data, partial=True
        )
        self.assertTrue(serializer.is_valid())
        indiening = serializer.save()
        self.assertEqual(indiening.groep, indiening.groep)
