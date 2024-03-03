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

from .views.views import microsoft_association, login_redirect
from .views.student import student_list

urlpatterns = [
    path('.well-known/microsoft-identity-association.json', microsoft_association),
    path('admin/', admin.site.urls),
    path('oauth2/', include('django_auth_adfs.urls')),
    path('login_redirect', login_redirect),
    path('api/studenten', student_list)
]