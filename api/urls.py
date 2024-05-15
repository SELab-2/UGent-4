"""
URL configuration for api project.

The `urlpatterns` list routes URLs to views. For more information please see:
    https://docs.djangoproject.com/en/5.0/topics/http/urls/
Examples:
Function views
    1. Add an import:  from my_app import views
    2. Add a URL to urlpatterns:  path('', views.home, name='home')
Class-based views
    1. Add an import:  from other_app.views import Home
    2. Add a URL to urlpatterns:  path('', Home.as_view(), name='home')
Including another URLconf
    1. Import the include() function: from django.urls import include, path
    2. Add a URL to urlpatterns:  path('blog/', include('blog.urls'))
"""

from django.contrib import admin
from django.urls import path, include
from rest_framework.urlpatterns import format_suffix_patterns

from .views.views import home
from .views.gebruiker import gebruiker_list, gebruiker_detail, gebruiker_detail_me
from .views.vak import vak_list, vak_detail, vak_detail_accept_invite
from .views.project import project_list, project_detail, project_detail_download_opgave
from .views.indiening import (
    indiening_list,
    indiening_detail,
    indiening_detail_download_bestanden,
    indiening_detail_download_artefacten
)
from .views.score import score_list, score_detail
from .views.groep import groep_list, groep_detail
from .views.template import template_list, template_detail
from .views.restrictie import (
    restrictie_list,
    restrictie_detail,
    restrictie_detail_download_script,
)

urlpatterns = [
    path("admin/", admin.site.urls),
    path("oauth2/", include("django_auth_adfs.urls")),
    path("api/", home, name="home"),
    path("api/gebruikers/", gebruiker_list, name="gebruiker_list"),
    path("api/gebruikers/<int:id>/", gebruiker_detail, name="gebruiker_detail"),
    path("api/gebruikers/me/", gebruiker_detail_me, name="gebruiker_detail_me"),
    path("api/vakken/", vak_list, name="vak_list"),
    path("api/vakken/<int:id>/", vak_detail, name="vak_detail"),
    path("api/vakken/<int:id>/accept_invite/", vak_detail_accept_invite, name="vak_detail_accept_invite"),
    path("api/projecten/", project_list, name="project_list"),
    path("api/projecten/<int:id>/", project_detail, name="project_detail"),
    path(
        "api/projecten/<int:id>/opgave_bestand/",
        project_detail_download_opgave,
        name="project_detail_download_opgave",
    ),
    path("api/indieningen/", indiening_list, name="indiening_list"),
    path("api/indieningen/<int:id>/", indiening_detail, name="indiening_detail"),
    path(
        "api/indieningen/<int:id>/indiening_bestanden/",
        indiening_detail_download_bestanden,
        name="indiening_detail_download_bestanden",
    ),
    path("api/indieningen/<int:id>/artefacten",
        indiening_detail_download_artefacten,
        name = "indiening_detail_download_artefacten",
    ),
    path("api/scores/", score_list, name="score_list"),
    path("api/scores/<int:id>/", score_detail, name="score_detail"),
    path("api/groepen/", groep_list, name="groep_list"),
    path("api/groepen/<int:id>/", groep_detail, name="groep_detail"),
    path("api/restricties/", restrictie_list, name="restrictie_list"),
    path("api/restricties/<int:id>/", restrictie_detail, name="restrictie_detail"),
    path(
        "api/restricties/<int:id>/script/",
        restrictie_detail_download_script,
        name="restrictie_detail_download_script",
    ),
    path("api/templates/", template_list, name="template_list"),
    path("api/templates/<int:id>/", template_detail, name="template_detail")
]

urlpatterns = format_suffix_patterns(urlpatterns)
