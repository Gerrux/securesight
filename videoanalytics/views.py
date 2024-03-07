from rest_framework import status
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.parsers import MultiPartParser, FormParser
from rest_framework.permissions import IsAuthenticated
from .serializers import VideoSerializer
from .models import Video


class VideoUploadView(APIView):
    parser_classes = [MultiPartParser, FormParser]
    permission_classes = [IsAuthenticated]

    def post(self, request, format=None):
        file = request.FILES['file']
        serializer = VideoSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save(uploaded_by=request.user, file=file)
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        else:
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


class VideoListView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request, format=None):
        videos = Video.objects.filter(uploaded_by=request.user)
        serializer = VideoSerializer(videos, many=True)
        return Response(serializer.data)
