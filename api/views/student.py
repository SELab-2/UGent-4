from django.http import JsonResponse
from rest_framework.decorators import api_view
from rest_framework.response import Response
from rest_framework import status


from ..models import Student
from ..serializers import StudentSerializer
from ..utils import json_error


@api_view(['GET', 'POST'])
def student_list(request):
    if request.method == 'GET':
        students = Student.objects.all()
        serializer = StudentSerializer(students, many=True)
        return JsonResponse({'studenten': serializer.data})
    elif request.method == 'POST':
        serializer = StudentSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_201_CREATED)


    """if request.user.is_superuser:
        students = Student.objects.all()
        serializer = StudentSerializer(students, many=True)
        return JsonResponse({'studenten': serializer.data})
    
    else:
        return json_error('no_perm')"""