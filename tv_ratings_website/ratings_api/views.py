from django.shortcuts import render
from rest_framework import filters, generics, viewsets, mixins
from .models import Series, Episode, EpisodeName, EpisodeRating
from .serializers import SeriesSerializer, EpisodeSerializer, EpisodeNameSerializer, EpisodeRatingSerializer

# class SeriesView(viewsets.ModelViewSet):
# Some shows get better, more specific search results than others
# if you search by primary title vs original title 
# so the frontend will make API calls for both searches
class SeriesView(mixins.ListModelMixin, viewsets.GenericViewSet):
    filter_backends = (filters.SearchFilter,)
    queryset = Series.objects.all()
    serializer_class = SeriesSerializer

# example call: /api/series_by_original_title/?search=House%20M.D.
class SeriesByOriginalTitleView(SeriesView):
    search_fields = ['original_title']

# example call: /api/series_by_primary_title/?search=House
class SeriesByPrimaryTitleView(SeriesView):
    search_fields = ['primary_title']

