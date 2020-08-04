from django.contrib import admin
from django.urls import path, include
from rest_framework import routers
from ratings_api import views

router = routers.DefaultRouter()
router.register(r'ratings', views.SeriesView, 'series')

urlpatterns = [
    path('admin/', admin.site.urls),
    path('api/', include(router.urls))
]