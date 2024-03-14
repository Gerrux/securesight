import tempfile
import uuid

from django.conf import settings
from django.core.files.base import ContentFile
from django.core.validators import FileExtensionValidator
from django.db import models
from django.utils.deconstruct import deconstructible
from rest_framework.exceptions import ValidationError

from .tasks import convert_video_to_hls


@deconstructible
class ContentTypeRestriction(object):
    def __init__(self, content_types):
        self.content_types = content_types

    def __call__(self, value):
        if isinstance(value, ContentFile):
            value.seek(0)
        main, sub = value.content_type.split('/')
        if (main, sub) not in self.content_types:
            raise ValidationError('Invalid content type.')


class Video(models.Model):
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    title = models.CharField(max_length=100)
    file = models.FileField(upload_to='videos/',
                            validators=[FileExtensionValidator(allowed_extensions=['mp4', 'avi', 'mkv'])])
    processed = models.BooleanField(default=False)
    ai_processed = models.BooleanField(default=False)
    uploaded_at = models.DateTimeField(auto_now_add=True)
    uploaded_by = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE)
    thumbnail = models.ImageField(upload_to='videos/thumbnails/', blank=True)
    slug = models.CharField(max_length=11, unique=True)
    video_versions = models.JSONField(default=dict, blank=True)
    log = models.JSONField(default=dict, blank=True)
    task_id = models.CharField(max_length=255, blank=True, null=True)

    def save(self, *args, **kwargs):
        if not self.slug:
            unique_id = uuid.uuid4()
            self.slug = str(unique_id)[:11]

        if not self.processed:
            with tempfile.NamedTemporaryFile() as temp_file:
                temp_file.write(self.file.read())
                temp_file.flush()

                task = convert_video_to_hls.delay(self.id)
                self.task_id = task.id

        super().save(*args, **kwargs)
