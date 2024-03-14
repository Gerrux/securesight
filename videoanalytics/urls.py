from django.urls import path

from . import views

urlpatterns = [
    path('', views.VideoListView.as_view(), name='video_list'),
    path('upload/', views.VideoUploadView.as_view(), name='upload_video'),
    path('count/', views.TotalVideosView.as_view(), name='total_videos'),
    path('processed/count/', views.TotalProcessedVideosView.as_view(), name='total_processed'),
    path('ai_processed/count/', views.TotalAIProcessedVideosView.as_view(), name='total_ai_processed'),
    path('<slug:slug>/', views.VideoDetailView.as_view(), name='video_detail'),
    path('<slug:slug>/ai_process/', views.SendVideoToAIAPIView.as_view(), name='ai_process_video'),
    path('tasks/<str:task_id>/', views.VideoTaskStatusView.as_view(), name='task_status'),

]
