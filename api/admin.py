from django.contrib import admin
from api.models.gebruiker import Gebruiker
from api.models.vak import Vak
from api.models.groep import Groep
from api.models.project import Project
from api.models.indiening import Indiening
from api.models.score import Score
from api.models.restrictie import Restrictie
from api.models.template import Template

admin.site.register(Gebruiker)
admin.site.register(Vak)
admin.site.register(Groep)
admin.site.register(Project)
admin.site.register(Indiening)
admin.site.register(Score)
admin.site.register(Restrictie)
admin.site.register(Template)
