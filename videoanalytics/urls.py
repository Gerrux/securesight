from django.urls import path
from . import views

urlpatterns = [
    path('', views.VideoListView.as_view(), name='video_list'),
    path('upload/', views.VideoUploadView.as_view(), name='upload_video'),
    path('<slug:slug>/', views.VideoDetailView.as_view(), name='video_detail'),
]
