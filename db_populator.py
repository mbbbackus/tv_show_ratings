#!/usr/bin/env python3
import os
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'tv_ratings_website.settings')

import django
django.setup()

import sys
import csv
from datetime import datetime
from ratings_api.models import Series, Episode, EpisodeRating, EpisodeName, Actor, Principal

import requests
import gzip
import shutil

urls = {
  "title.basics.tsv": "https://datasets.imdbws.com/title.basics.tsv.gz",
  "title.episode.tsv": "https://datasets.imdbws.com/title.episode.tsv.gz",
  "title.ratings.tsv": "https://datasets.imdbws.com/title.ratings.tsv.gz",
  "title.principals.tsv": "https://datasets.imdbws.com/title.principals.tsv.gz",
  "name.basics.tsv": "https://datasets.imdbws.com/name.basics.tsv.gz"
}

new_dir_path = os.path.join(os.getcwd(),"data")
if not os.path.exists(new_dir_path):
  os.mkdir(new_dir_path)

for url in urls:
  if os.path.exists('./data/{0}'.format(url)):
    continue
  r = requests.get(urls[url], allow_redirects=True)
  open('./data/{0}.gz'.format(url), 'wb').write(r.content)

  with gzip.open('./data/{0}.gz'.format(url), 'rb') as f_in:
    with open('./data/{0}'.format(url), 'wb') as f_out:
      shutil.copyfileobj(f_in, f_out)

if "series" in sys.argv:
  with open("./data/title.basics.tsv") as basics_file:
    basics_file_lines = csv.reader(basics_file, delimiter="\t")

    #ex. tt0412142;tvSeries;House;House M.D.;0;2004;2012;44;Drama,Mystery
    for row in basics_file_lines:
      if row[1] != "tvSeries" and row[1] != "tvMiniSeries":
        continue
      start_year = row[5]
      end_year = row[6]
      if start_year == '\\N' or start_year == '\\\\N':
        start_year = -1
      if end_year == '\\N' or end_year == '\\\\N':
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
      except Exception as e:
        print("series: ERROR: {0}, IN ROW".format(str(type(e))), row)

if "episodes" in sys.argv:
  if "resetdb" in sys.argv:
    Episode.objects.all().delete()
  with open("./data/title.episode.tsv") as episode_file:
    episode_reader = csv.reader(episode_file, delimiter="\t")

    now = datetime.now()
    num_episodes = 0

    #ex. tt0041951  tt0041038 1 9
    for row in episode_reader:
      if row[0] == "tconst":
        continue
      num_episodes += 1

      episode_id = row[0]
      series_id = row[1]
      season_number = row[2]
      episode_number = row[3]
      if season_number == '\\N' or season_number == '\\\\N':
        season_number = -1
      if episode_number == '\\N' or episode_number == '\\\\N':
        episode_number = -1
      try:
        series = Series.objects.get(id=series_id)
        series.episodes.create(
          id=episode_id,
          season_number=season_number,
          episode_number=episode_number
        )
      except Exception as e:
        print("episode: ERROR: {0}, IN ROW".format(str(type(e))), row)

      if (datetime.now() - now).seconds > 60:
        print("Episodes added: ", num_episodes)
        now = datetime.now()

if "names" in sys.argv:
  with open("./data/title.basics.tsv") as basics_file:
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
        episode.names.create(
          primary_name=row[2],
          original_name=row[3]
        )
      except Exception as e:
        print("episode name: ERROR: {0}, IN ROW".format(str(type(e))), row)

      if (datetime.now() - now).seconds > 60:
        print("Episode Names added: ", num_episode_names)
        now = datetime.now()

if "ratings" in sys.argv:
  with open("./data/title.ratings.tsv") as ratings_file:
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
          episode.ratings.create(
            average_rating=float(row[1]),
            num_votes=int(row[2])
          )
        except Exception as e:
          print("rating: ERROR: {0}, IN ROW".format(str(type(e))), row)

      if (datetime.now() - now).seconds > 60:
        print("Episode Ratings added: ", num_episode_ratings)
        now = datetime.now()

if "actors" in sys.argv:
  with open("./data/name.basics.tsv") as actors_file:
    actors_file_lines = csv.reader(actors_file, delimiter="\t")

    now = datetime.now()
    num_actors = 0

    for row in actors_file_lines:
      if row[0] == "nconst":
        continue
      num_actors += 1

      birth_year = -1
      death_year = -1

      if row[2] != "\\N":
        birth_year = row[2]
      if row[3] != "\\N":
        death_year = row[3]

      try:
        Actor(
          id=str(row[0]),
          primary_name=str(row[1]),
          birth_year=int(birth_year),
          death_year=int(death_year),
          primary_profession=str(row[4]),
          known_for=str(row[5])
        ).save()
      except Exception as e:
        print("actor: ERROR: {0}, IN ROW".format(str(type(e))), row)
        # break

      if (datetime.now() - now).seconds > 60:
        print("Actors added: ", num_actors)
        now = datetime.now()

if "principals" in sys.argv:
    with open("./data/title.principals.tsv") as principals_file:
      principals_file_lines = csv.reader(principals_file, delimiter="\t")

      now = datetime.now()
      num_principals = 0

      for row in principals_file_lines:
          if row[0] == "tconst":
            continue
          num_principals += 1

          ordering = -1
          if row[1] != "\\N":
            ordering = row[1]

          title = Episode.objects.filter(id=row[0])
          actor = Actor.objects.filter(id=row[2])
          if len(title) == 0 or len(actor) == 0:
            continue

          try:
            Principal(
              title=title[0],
              ordering=ordering,
              actor=actor[0],
              category=row[3],
              job=row[4],
              characters=row[5]
            ).save()
          except Exception as e:
            print("principal: ERROR: {0}, IN ROW".format(str(type(e))), row)
            # break

          if (datetime.now() - now).seconds > 60:
            print("Principals added: ", num_principals)
            now = datetime.now()














