#!/usr/bin/env python3
import os
os.environ.setdefault('DJANGO_SETTINGS_MODULE',
                      'tv_ratings_website.settings')

import django
django.setup()

import csv
from datetime import datetime
import ratings_api
from ratings_api.models import Series, Episode, EpisodeRating, EpisodeName


# janky way to put all my scripts in one file but only run
# one at a time; i'd use sys.args but i dont wanna rn
populated = {
	"series": True,
	"episodes": True,
	"names": True,
	"ratings": False
}

if not populated["series"]:
	with open("../data/title.basics.tsv") as basics_file:
		basics_file_lines = csv.reader(basics_file, delimiter="\t")

		#ex. tt0412142;tvSeries;House;House M.D.;0;2004;2012;44;Drama,Mystery
		for row in basics_file_lines:
			if row[1] != "tvSeries" and row[1] != "tvMiniSeries":
				continue
			start_year = row[5]
			end_year = row[6]
			if start_year == '\\N':
				start_year = -1
			if end_year == '\\N':
				end_year = -1
			try:
				s = Series(
					id=row[0], 
					primary_title=row[2], 
					original_title=row[3], 
					start_year=start_year, 
					end_year=end_year
				)
				s.save()
			except:
				print("series: ERROR IN ROW", row)

if not populated["episodes"]:
	with open("../data/title.episode.tsv") as episode_file:
		episode_reader = csv.reader(episode_file, delimiter="\t")

		now = datetime.now()
		num_episodes = 0

		#ex. tt0041951	tt0041038	1	9
		for row in episode_reader:
			if row[0] == "tconst":
				continue
			num_episodes += 1

			series_id = row[1]
			season_number = row[2]
			episode_number = row[3]
			if season_number == '\\N':
				season_number = -1
			if episode_number == '\\N':
				episode_number = -1
			try:
				series = Series.objects.get(id=series_id)
				series.episode_set.create(
					id=row[0],
					season_number=season_number,
					episode_number=episode_number
				)
			except:
				print("episode: ERROR IN ROW", row)

			if (datetime.now() - now).seconds > 60:
				print("Episodes added: ", num_episodes)
				now = datetime.now()

if not populated["names"]:
	with open("../data/title.basics.tsv") as basics_file:
		basics_file_lines = csv.reader(basics_file, delimiter="\t")

		now = datetime.now()
		num_episode_names = 0

		for row in basics_file_lines:
			if row[0] == "tconst" or row[1] != "tvEpisode":
				continue
			num_episode_names += 1

			episode_id = row[0]
			try:
				episode = Episode.objects.get(id=episode_id)
				episode.episodename_set.create(
					primary_name=row[2],
					original_name=row[3]
				)
			except:
				print("episode: ERROR IN ROW", row)

			if (datetime.now() - now).seconds > 60:
				print("Episode Names added: ", num_episode_names)
				now = datetime.now()

if not populated["ratings"]:
	with open("../data/title.ratings.tsv") as ratings_file:
		ratings_file_lines = csv.reader(ratings_file, delimiter="\t")

		now = datetime.now()
		num_episode_ratings = 0

		for row in ratings_file_lines:
			if row[0] == "tconst":
				continue
			num_episode_ratings += 1

			episode_id = row[0]
			
			episodes = Episode.objects.filter(id=episode_id)
			is_episode_rating = episodes.count()
			if is_episode_rating:
				episode = episodes[0]
				try:
					episode.episoderating_set.create(
						average_rating=float(row[1]),
						num_votes=int(row[2])
					)
				except:
					print("episode: ERROR IN ROW", row)

			if (datetime.now() - now).seconds > 60:
				print("Episode Ratings added: ", num_episode_ratings)
				now = datetime.now()















