#!/usr/bin/env python3
import os
os.environ.setdefault('DJANGO_SETTINGS_MODULE',
                      'tv_ratings_website.settings')

import django
django.setup()

import csv
from ratings_api.models import Series

with open("../data/title.basics.tsv") as basics_file:
	basics_reader = csv.reader(basics_file, delimiter="\t")

	#ex. tt0412142;tvSeries;House;House M.D.;0;2004;2012;44;Drama,Mystery
	for row in basics_reader:
		if row[1] == "tvSeries":
			s = Series(
				id=row[0], 
				primary_title=row[2], 
				original_title=row[3], 
				start_year=row[5], 
				end_year=row[6]
			)
			s.save()