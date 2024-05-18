from django.test import TestCase
from api.tests.factories.indiening import IndieningFactory
from api.models.indiening import upload_to
from unittest.mock import patch, MagicMock, call
from api.models.indiening import send_indiening_confirmation_mail
from email.mime.multipart import MIMEMultipart
from email.mime.text import MIMEText
import os


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

    @patch("smtplib.SMTP_SSL")
    @patch("ssl.create_default_context")
    def test_send_indiening_confirmation_mail(
        self, mock_create_default_context, mock_smtp
    ):
        indiening = self.indiening
        project = indiening.groep.project

        smtp_server_address = "smtp.gmail.com"
        smtp_port = 465
        mail_username = os.environ.get("MAIL_USERNAME")
        mail_app_password = os.environ.get("MAIL_APP_PASSWORD")
        indiening_status = {
            -1: "heeft niet alle testen geslaagd.",
            0: "wordt nog getest...",
            1: "heeft alle testen geslaagd!",
        }
        project_url = f"https://sel2-4.ugent.be/course/{project.vak.vak_id}/assignment/{project.project_id}"
        indiening_url = f"https://sel2-4.ugent.be/course/{project.vak.vak_id}/assignment/ \
            {project.project_id}/submission/{indiening.indiening_id}"

        # Setup the mock SMTP_SSL object
        mock_smtp_instance = MagicMock()
        mock_smtp.return_value.__enter__.return_value = mock_smtp_instance

        # Call the function
        send_indiening_confirmation_mail(indiening)

        # Check that create_default_context was called once
        assert mock_create_default_context.call_count == 1

        # Check that SMTP_SSL was called with the correct arguments
        assert mock_smtp.call_count == indiening.groep.studenten.count()
        mock_smtp.assert_has_calls(
            [
                call(
                    smtp_server_address,
                    smtp_port,
                    context=mock_create_default_context.return_value,
                )
            ]
            * indiening.groep.studenten.count()
        )

        # Check that login was called with the correct arguments
        mock_smtp_instance.login.assert_called_with(mail_username, mail_app_password)

        # Check that sendmail was called once for each student
        assert (
            mock_smtp_instance.sendmail.call_count == indiening.groep.studenten.count()
        )

        # Check that sendmail was called with the correct arguments
        for student in indiening.groep.studenten.all():
            subject = "Indieningsontvangst"

            email = MIMEMultipart("alternative")
            email["Subject"] = subject
            email["From"] = mail_username
            email["To"] = student.user.email

            plain_text = f"""
            Beste {student.user.first_name} {student.user.last_name},

            Dit is een bevestiging dat uw indiening voor het project {project.titel} is ontvangen.
            De indiening {indiening_status[indiening.status]}.
            """

            html_text = f"""
            <html>
            <body>
            <p>Beste {student.user.first_name} {student.user.last_name}</p>
            <p>Dit is een bevestiging dat uw indiening voor het project \
                <a href="{project_url}">{project.titel}</a> is ontvangen.</p>
            <p>De <a href="{indiening_url}">indiening</a> {indiening_status[indiening.status]}</p>
            </body>
            </html>
            """

            email.attach(MIMEText(plain_text, "plain"))
            email.attach(MIMEText(html_text, "html"))

            call_args_list = mock_smtp_instance.sendmail.call_args_list
            for mock_call in call_args_list:
                (
                    sent_mail_username,
                    sent_student_email,
                    sent_email_content,
                ) = mock_call.args
                assert sent_mail_username == mail_username
                assert sent_student_email == student.user.email
                assert subject in sent_email_content
                assert (
                    f"Beste {student.user.first_name} {student.user.last_name}"
                    in sent_email_content
                )
                assert (
                    f"Dit is een bevestiging dat uw indiening voor het project {project.titel} is ontvangen."
                    in sent_email_content
                )
                assert (
                    f"De indiening {indiening_status[indiening.status]}"
                    in sent_email_content
                )
