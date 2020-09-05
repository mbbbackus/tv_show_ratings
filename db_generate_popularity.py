#!/usr/bin/env python3
import os
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'tv_ratings_website.settings')

import django
django.setup()

from datetime import datetime
from ratings_api.models import Series, Episode, EpisodeRating

now = datetime.now()
num_series = 0
for series in Series.objects.all():
	num_series += 1 
	if series.popularity == -1:
		eps = series.episodes.all()
		if len(eps) == 0:
			continue
		rand_ep = eps[0]
		ratings = rand_ep.ratings.all()
		if len(ratings) == 0:
			continue
		series.popularity = ratings[0].num_votes
		series.save()

	if (datetime.now() - now).seconds > 60:
		print("Episodes added: ", num_series)
		now = datetime.now()
