from django.http import JsonResponse
from rest_framework.decorators import api_view
from rest_framework.response import Response
from rest_framework import status


<<<<<<< HEAD
from api.models.student import Student
from api.serializers.student import StudentSerializer
from ..utils import json_error
=======
from ..models import Student
from ..serializers.student import StudentSerializer
>>>>>>> develop


@api_view(['GET', 'POST'])
def student_list(request):
    if request.method == 'GET':
        students = Student.objects.all()
        serializer = StudentSerializer(students, many=True)
        return Response(serializer.data)
    elif request.method == 'POST':
        serializer = StudentSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_201_CREATED)
<<<<<<< HEAD


    """if request.user.is_superuser:
        students = Student.objects.all()
        serializer = StudentSerializer(students, many=True)
        return JsonResponse({'studenten': serializer.data})

    else:
        return json_error('no_perm')"""
=======
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
        
    
@api_view(['GET', 'PUT'])
def student_detail(request, id):
    try:
        student = Student.objects.get(pk=id)
    except Student.DoesNotExist:
        return Response(status=status.HTTP_404_NOT_FOUND)

    if request.method == 'GET':
        serializer = StudentSerializer(student)
        return Response(serializer.data)
    elif request.method == 'PUT':
        serializer = StudentSerializer(student, data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
>>>>>>> develop
