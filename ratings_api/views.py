from django.shortcuts import render
from rest_framework import filters, generics, viewsets, mixins
from .models import Series, Actor, Appearance, Episode
from .serializers import SeriesSerializer, SeriesSearchSerializer, SeriesAppearancesSerializer
from .imdb_scraper import scrape_cast

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

# example call: /api/series/tt0412142/
class SeriesView(viewsets.ModelViewSet):
    serializer_class = SeriesSerializer
    queryset = Series.objects.all()


class SeriesAppearancesView(viewsets.ModelViewSet):
	serializer_class = SeriesAppearancesSerializer

	def get_object(self): # kinda hacky, using series pks to get list appearances
		series_ttid = str(self.kwargs['pk'])
		series = Series.objects.get(id=series_ttid)
		script_has_run = (len(series.episodes.all()[0].appearances.all()) > 0)
		if not script_has_run:
			cast_dict = scrape_cast(series_ttid)
			for nm in cast_dict:
				actor = None
				actor_results = Actor.objects.filter(id=nm)
				if len(actor_results) > 0:
					actor = actor_results[0]
				else:
					actor = Actor(primary_name=cast_dict[nm]['actor'])
					actor.save()

				for episode in cast_dict[nm]['episodes']:
					ep = Episode.objects.get(id=episode['ttid'])
					app = Appearance(episode=ep, actor=actor,characters=str([episode["character"]]))
					app.save()

		return series











