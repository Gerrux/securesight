from django.core.validators import FileExtensionValidator
from rest_framework import serializers
from .models import Video, ContentTypeRestriction


class VideoSerializer(serializers.ModelSerializer):
    uploaded_by = serializers.ReadOnlyField(source='uploaded_by.username')

    class Meta:
        model = Video
        fields = ['id', 'title', 'file', 'processed', 'uploaded_at', 'uploaded_by']
        extra_kwargs = {
            'file': {
                'validators': [FileExtensionValidator(allowed_extensions=['mp4', 'avi', 'mkv'])],
            }
        }

    def validate_file(self, value):
        if value.content_type not in ['video/mp4', 'video/avi', 'video/mkv']:
            raise serializers.ValidationError('Invalid content type.')
        return value


class VideoListSerializer(serializers.ModelSerializer):
    uploaded_by = serializers.ReadOnlyField(source='uploaded_by.username')
    thumbnail = serializers.ImageField(read_only=True)

    class Meta:
        model = Video
        fields = ['id', 'title', 'thumbnail', 'processed', 'uploaded_at', 'uploaded_by', 'slug']
