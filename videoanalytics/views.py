import os

from celery.result import AsyncResult
from django.conf import settings
from django.http import HttpResponse, Http404
from rest_framework import status
from rest_framework.parsers import MultiPartParser, FormParser
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from rest_framework.views import APIView
from rest_framework_simplejwt.authentication import JWTAuthentication

from .models import Video
from .serializers import VideoSerializer, VideoListSerializer


class VideoUploadView(APIView):
    parser_classes = [MultiPartParser, FormParser]
    authentication_classes = [JWTAuthentication]
    permission_classes = [IsAuthenticated]

    def post(self, request, format=None):
        serializer = VideoSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save(uploaded_by=request.user)
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        else:
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


class VideoListView(APIView):
    authentication_classes = [JWTAuthentication]
    permission_classes = [IsAuthenticated]

    def get(self, request, format=None):
        videos = Video.objects.filter(uploaded_by=request.user)
        serializer = VideoListSerializer(videos, many=True)
        return Response(serializer.data)


class VideoDetailView(APIView):
    authentication_classes = [JWTAuthentication]
    permission_classes = [IsAuthenticated]

    def get(self, request, slug, format=None):
        try:
            video = Video.objects.get(slug=slug, uploaded_by=request.user)
            serializer = VideoSerializer(video)
            if not video.processed:
                return Response({"error": "Video is not processed yet."}, status=status.HTTP_400_BAD_REQUEST)

            # Получите список доступных версий для конкретного видео
            available_versions = list(video.video_versions.keys())

            version = request.GET.get('version', '240p')
            # Проверьте, что запрашиваемая версия доступна для этого видео
            if version not in available_versions:
                return Response({"error": f"Version {version} not available for this video."}, status=status.HTTP_400_BAD_REQUEST)

            # Нормализуйте путь к файлу плейлиста HLS
            hls_path = os.path.normpath(video.video_versions[version]).replace('\\', '/')
            hls_url = request.build_absolute_uri(os.path.join(settings.MEDIA_URL, hls_path))
            print(hls_url)
            return Response({"hls_manifest_url": hls_url, "video": serializer.data})
        except Video.DoesNotExist:
            return Response(status=status.HTTP_404_NOT_FOUND)

    def delete(self, request, slug, format=None):
        try:
            video = Video.objects.get(slug=slug, uploaded_by=request.user)
            video.delete()
            return Response(status=status.HTTP_204_NO_CONTENT)
        except Video.DoesNotExist:
            return Response(status=status.HTTP_404_NOT_FOUND)

    def retrieve(self, request, slug, format=None):
        try:
            video = Video.objects.get(slug=slug, uploaded_by=request.user)
            serializer = VideoSerializer(video)
            return Response(serializer.data)
        except Video.DoesNotExist:
            return Response(status=status.HTTP_404_NOT_FOUND)


class VideoTaskStatusView(APIView):
    authentication_classes = [JWTAuthentication]
    permission_classes = [IsAuthenticated]

    def get(self, request, task_id, format=None):
        try:
            task = AsyncResult(task_id)
            response_data = {
                'status': task.status,
                'result': task.result,
            }
            if status == 'FAILURE':
                response_data['error'] = task.info.get('exception', 'Unknown error')
            return Response(response_data)
        except AsyncResult.NotRegistered:
            raise Http404('Task not found')
