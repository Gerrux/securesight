"""
URL configuration for securesight project.

The `urlpatterns` list routes URLs to views. For more information please see:
    https://docs.djangoproject.com/en/5.0/topics/http/urls/
Examples:
Function views
    1. Add an import:  from my_app import views
    2. Add a URL to urlpatterns:  path('', views.home, name='home')
Class-based views
    1. Add an import:  from other_app.views import Home
    2. Add a URL to urlpatterns:  path('', Home.as_view(), name='home')
Including another URLconf
    1. Import the include() function: from django.urls import include, path
    2. Add a URL to urlpatterns:  path('blog/', include('blog.urls'))
"""
from django.conf import settings
from django.conf.urls.static import static
from django.contrib import admin
from django.contrib.staticfiles.urls import staticfiles_urlpatterns
from django.urls import path, include, re_path
from django.views.generic.base import RedirectView

from securesight import views

urlpatterns = [
                  # re_path(r'^favicon\.ico$', RedirectView.as_view(url=static('favicon.ico'))),
                  path('admin/', admin.site.urls),
                  path('api/', include('authapi.urls')),
                  path('backvideos/', include('videoanalytics.urls')),
                  path('index/', views.index, name='home'),
              ] + static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT) + staticfiles_urlpatterns()
