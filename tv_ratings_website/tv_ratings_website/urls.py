from django.contrib import admin
from django.urls import path, include
from rest_framework import routers
from ratings_api import views

router = routers.DefaultRouter()
router.register(r'series_by_original_title', views.SeriesSearchByOriginalTitleView, 'series_original_title')
router.register(r'series_by_primary_title', views.SeriesSearchByPrimaryTitleView, 'series_primary_title')
router.register(r'series', views.SeriesView, 'series')


urlpatterns = [
    path('admin/', admin.site.urls),
    path('api/', include(router.urls))
]