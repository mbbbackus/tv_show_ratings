from django.shortcuts import render
from rest_framework import filters, generics, viewsets
from .models import Series, Episode, EpisodeName, EpisodeRating
from .serializers import SeriesSerializer, EpisodeSerializer, EpisodeNameSerializer, EpisodeRatingSerializer

class SeriesView(viewsets.ModelViewSet):
    search_fields = ['primary_title']
    filter_backends = (filters.SearchFilter,)
    queryset = Series.objects.all()
    serializer_class = SeriesSerializer
