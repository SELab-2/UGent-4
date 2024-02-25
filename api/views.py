from django.shortcuts import render
from django.http import HttpResponse

from django.http import JsonResponse

def microsoft_association(request):
    #return HttpResponse("yolo")
    return JsonResponse({"associatedApplications": [{ "applicationId": "239ce609-e362-4cf6-919f-97e6935ef5f5" }]})

def main(request):
    return HttpResponse("my http resonse")
