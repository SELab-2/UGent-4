from django.conf import settings
from api.models.gebruiker import Gebruiker
import requests
import smtplib
from email.mime.text import MIMEText
from email.mime.multipart import MIMEMultipart
import ssl
import os
from dotenv import load_dotenv

load_dotenv()

smtp_server_address = "smtp.gmail.com"
smtp_port = 465
mail_username = os.environ.get("MAIL_USERNAME")
mail_app_password = os.environ.get("MAIL_APP_PASSWORD")

indiening_status = {
    -1: "heeft niet alle testen geslaagd.",
    0: "wordt nog getest...",
    1: "heeft alle testen geslaagd!",
}


API_URLS = {
    "gebruikers": "/api/gebruikers",
    "vakken": "/api/vakken",
    "groepen": "/api/groepen",
    "indieningen": "/api/indieningen",
    "scores": "api/scores",
    "projecten": "api/projecten",
    "restricties": "api/restricties",
    "templates": "api/templates",
}


def get_graph_token():
    """
    Get graph token from AD url.
    """
    try:
        url = settings.AD_URL

        headers = {
            "Content-Type": "application/x-www-form-urlencoded",
            "Accept": "application/json",
        }

        data = {
            "grant_type": "client_credentials",
            "client_id": settings.CLIENT_ID,
            "client_secret": settings.CLIENT_SECRET,
            "scope": "https://graph.microsoft.com/.default",
        }

        response = requests.post(url=url, headers=headers, data=data)
        return response.json()
    except Exception:
        return None


def has_permissions(user):
    """
    Controleert of de gebruiker permissies heeft.

    Args:
        user (User): De gebruiker waarvan moet worden gecontroleerd of deze permissies heeft.

    Returns:
        bool: True als de gebruiker permissies heeft, anders False.
    """
    if user.is_superuser:
        return True
    gebruiker = Gebruiker.objects.get(pk=user.id)
    return gebruiker.is_lesgever


def is_lesgever(user):
    """
    Controleert of de gebruiker een lesgever is.

    Args:
        user (User): De gebruiker waarvan moet worden gecontroleerd of deze een lesgever is.

    Returns:
        bool: True als de gebruiker een lesgever is, anders False.
    """
    gebruiker = Gebruiker.objects.get(pk=user.id)
    return gebruiker.is_lesgever


def contains(lijst, user):
    """
    Controleert of de gebruiker aanwezig is in de gegeven lijst.

    Args:
        lijst (QuerySet): De lijst waarin moet worden gecontroleerd.
        user (User): De gebruiker waarvan moet worden gecontroleerd of deze aanwezig is in de lijst.

    Returns:
        bool: True als de gebruiker aanwezig is in de lijst, anders False.
    """
    gebruiker = Gebruiker.objects.get(pk=user.id)
    return lijst.all().contains(gebruiker)


def get_gebruiker(user):
    """
    Haalt de Gebruiker-instantie op voor de gegeven gebruiker.

    Args:
        user (User): De gebruiker waarvoor de Gebruiker-instantie moet worden opgehaald.

    Returns:
        Gebruiker: De Gebruiker-instantie voor de gegeven gebruiker.
    """
    return Gebruiker.objects.get(pk=user.id)


def send_indiening_confirmation_mail(indiening):
    """
    Verstuurt een bevestigingsmail naar alle studenten in de groep voor een specifieke indiening.

    Args:
        indiening (Indiening): De indiening waarvoor de bevestigingsmail verstuurd moet worden.
    """
    project = indiening.groep.project

    project_url = f"https://sel2-4.ugent.be/course/{project.vak.vak_id}/assignment/{project.project_id}"
    indiening_url = f"https://sel2-4.ugent.be/course/{project.vak.vak_id}/assignment/ \
        {project.project_id}/submission/{indiening.indiening_id}"

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

        context = ssl.create_default_context()
        with smtplib.SMTP_SSL(
            smtp_server_address, smtp_port, context=context
        ) as smtp_server:
            smtp_server.login(mail_username, mail_app_password)
            smtp_server.sendmail(mail_username, student.user.email, email.as_string())
