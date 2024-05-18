from django.test import TestCase
from api.tests.factories.indiening import IndieningFactory
from api.models.indiening import upload_to
from unittest.mock import patch, call, MagicMock
from api.models.indiening import send_indiening_confirmation_mail
import os
from email.mime.multipart import MIMEMultipart
from email.mime.text import MIMEText


class IndieningModelTest(TestCase):
    @patch("api.models.indiening.send_indiening_confirmation_mail")
    def setUp(self, mock_send_mail):
        self.indiening = IndieningFactory.create()

    def test_str_method(self):
        self.assertEqual(str(self.indiening), str(self.indiening.indiening_id))

    def test_groep(self):
        self.assertIsNotNone(self.indiening.groep)

    def test_tijdstip(self):
        self.assertIsNotNone(self.indiening.tijdstip)

    def test_status(self):
        self.assertIsNotNone(self.indiening.status)

    def test_upload_to(self):
        filename = "test_indiening.txt"
        expected_path = (
            f"data/indieningen/indiening_{self.indiening.indiening_id}/{filename}"
        )
        self.assertEqual(upload_to(self.indiening, filename), expected_path)

    def test_artefacten(self):
        self.assertIsNotNone(self.indiening.artefacten)

    def test_result(self):
        self.assertIsNotNone(self.indiening.result)

    def test_bestand(self):
        self.assertIsNotNone(self.indiening.bestand)

    # TODO: Fix this test
    # @patch('smtplib.SMTP_SSL')
    # @patch('ssl.create_default_context')
    # def test_send_indiening_confirmation_mail(self, mock_create_default_context, mock_smtp):
    #     # Create a test indiening object
    #     mock_create_default_context.reset_mock()
    #     mock_smtp.reset_mock()
    #     indiening = self.indiening

    #     smtp_server_address = "smtp.gmail.com"
    #     smtp_port = 465
    #     mail_username = os.environ.get("MAIL_USERNAME")
    #     mail_app_password = os.environ.get("MAIL_APP_PASSWORD")
    #     indiening_status = {
    #         -1: "heeft niet alle testen geslaagd.",
    #         0: "wordt nog getest...",
    #         1: "heeft alle testen geslaagd!",
    #     }

    #     # Setup the mock SMTP_SSL object
    #     mock_smtp_instance = MagicMock()
    #     mock_smtp.return_value.__enter__.return_value = mock_smtp_instance

    #     # Call the function
    #     send_indiening_confirmation_mail(indiening)

    #     # Check that create_default_context was called twice
    #     assert mock_create_default_context.call_count == 1

    #     # Check that SMTP_SSL was called with the correct arguments
    #     assert mock_smtp.call_count == indiening.groep.studenten.count()
    #     mock_smtp.assert_has_calls([call(smtp_server_address, smtp_port, context=mock_create_default_context.return_value)] * indiening.groep.studenten.count())

    #     # Check that login was called with the correct arguments
    #     mock_smtp_instance.login.assert_called_with(mail_username, mail_app_password)

    #     # Check that sendmail was called with the correct arguments for each student
    #     for student in indiening.groep.studenten.all():
    #         plain_text = f"""
    #         Beste {student.user.first_name} {student.user.last_name},

    #         Dit is een bevestiging dat uw indiening voor het project {indiening.groep.project.titel} is ontvangen.
    #         De indiening {indiening_status[indiening.status]}.
    #         """
    #         email = MIMEMultipart()
    #         email["From"] = mail_username
    #         email["To"] = student.user.email
    #         email["Subject"] = "Bevestiging van indiening"
    #         email.attach(MIMEText(plain_text, "plain"))
    #         mock_smtp_instance.sendmail.assert_any_call(mail_username, student.user.email, email.as_string())
