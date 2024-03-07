from django.conf import settings
from django.core.files.base import ContentFile
from django.db import models
from django.utils.deconstruct import deconstructible
from rest_framework.exceptions import ValidationError

from videoanalytics.utils.generate_thumbnail import generate_thumbnail


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
    title = models.CharField(max_length=100)
    file = models.FileField(upload_to='videos/')
    processed = models.BooleanField(default=False)
    uploaded_at = models.DateTimeField(auto_now_add=True)
    uploaded_by = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE)
    thumbnail = models.ImageField(upload_to='thumbnails/', blank=True)

    def save(self, *args, **kwargs):
        super().save(*args, **kwargs)
        if not self.thumbnail:
            # Generate thumbnail
            thumbnail = generate_thumbnail(self.file.path)
            # Save thumbnail
            self.thumbnail.save(f'{self.file.name}.jpg', thumbnail, save=False)
        super().save(*args, **kwargs)

