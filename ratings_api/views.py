from django.shortcuts import render
from rest_framework import filters, generics, viewsets, mixins
from .models import Series
from .serializers import SeriesSerializer, SeriesSearchSerializer#, CastSerializer

# class SeriesSearchView(viewsets.ModelViewSet):
# Some shows get better, more specific search results than others
# if you search by primary title vs original title 
# so the frontend will make API calls for both searches
class SeriesSearchView(mixins.ListModelMixin, viewsets.GenericViewSet):
    filter_backends = (filters.SearchFilter,)
    queryset = Series.objects.all()
    serializer_class = SeriesSearchSerializer

# example call: /api/series_by_original_title/?search=House%20M.D.
class SeriesSearchByOriginalTitleView(SeriesSearchView):
    search_fields = ['original_title']

# example call: /api/series_by_primary_title/?search=House
class SeriesSearchByPrimaryTitleView(SeriesSearchView):
    search_fields = ['primary_title']


# Unlike the search view, this is not for listing.
# takes specific id and returns the series with all its episodes
# and ratings data; much more dense and inefficient
#
# example call: /api/series/tt0412142/
# provided that "tt0412142" is the id for the show, "House M.D."
class SeriesView(viewsets.ModelViewSet):
    serializer_class = SeriesSerializer
    queryset = Series.objects.all()

# class CastView(viewsets.ModelViewSet):
#     queryset = []
#     serializer_class = CastSerializer

#     def get_object(self):
#         return {"actor": str(self.kwargs)}
