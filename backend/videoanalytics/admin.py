from django.contrib import admin

from .models import Video


class VideoAdmin(admin.ModelAdmin):
    list_display = ('title', 'uploaded_at', 'uploaded_by', 'processed')
    search_fields = ('title', 'uploaded_by__username')
    ordering = ('-uploaded_at',)
    readonly_fields = ('slug', 'video_versions')


admin.site.register(Video, VideoAdmin)
