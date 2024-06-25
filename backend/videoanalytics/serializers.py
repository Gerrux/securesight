from rest_framework import serializers

from .models import Video, ContentTypeRestriction


class VideoSerializer(serializers.ModelSerializer):
    uploaded_by = serializers.ReadOnlyField(source='uploaded_by.username')

    class Meta:
        model = Video
        fields = ['id', 'title', 'file', 'processed', 'uploaded_at', 'uploaded_by', 'thumbnail', 'video_versions', 'log']
        extra_kwargs = {
            'file': {
                'validators': [
                    ContentTypeRestriction(content_types=(('video', 'mp4'), ('video', 'avi'), ('video', 'mkv')))]
            }
        }


class VideoListSerializer(serializers.ModelSerializer):
    uploaded_by = serializers.ReadOnlyField(source='uploaded_by.username')
    thumbnail = serializers.ImageField(read_only=True)
    task_id = serializers.CharField(read_only=True)

    class Meta:
        model = Video
        fields = ['id', 'title', 'thumbnail', 'processed', 'ai_processed', 'uploaded_at', 'uploaded_by', 'slug', 'video_versions',
                  'task_id', 'log']
