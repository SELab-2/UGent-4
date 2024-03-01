from django.contrib import admin
from .models.student import *
from .models.lesgever import *
from .models.vak import *
from .models.groep import *
from .models.project import *
from .models.indiening import *
from .models.score import *

admin.site.register(Student)
admin.site.register(Lesgever)
admin.site.register(Vak)
admin.site.register(Groep)
admin.site.register(Project)
admin.site.register(Indiening)
admin.site.register(Score)
