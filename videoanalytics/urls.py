from django.urls import path
from . import views

urlpatterns = [
    path('upload', views.VideoUploadView.as_view(), name='register'),
]
