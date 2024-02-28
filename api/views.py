from django.shortcuts import render
from django.http import HttpResponse

from django.http import JsonResponse

from .models import *
from .serializers import *

def microsoft_association(request):
    return JsonResponse({"associatedApplications": [{ "applicationId": "239ce609-e362-4cf6-919f-97e6935ef5f5" }]})

def main(request):
    return HttpResponse("my http resonse")

def student_list(reqeust):
    # get all students
    # serialize
    # return json
    students = Student.objects.all()
    serializer = StudentSerializer(students, many=True)
    return JsonResponse({'students':serializer.data}, safe=False)
