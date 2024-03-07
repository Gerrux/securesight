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
                'validators': [FileExtensionValidator(allowed_extensions=['mp4', 'avi', 'mkv']),
                               ContentTypeRestriction(['video/mp4', 'video/avi', 'video/mkv'])]
            }
        }
