import uuid
from django.db import models

class Series(models.Model):
	id = models.CharField(max_length=16, primary_key=True, editable=False)
	primary_title = models.CharField(max_length=200)
	original_title = models.CharField(max_length=200)
	start_year = models.IntegerField(default=-1)
	end_year = models.IntegerField(default=-1) 

class Episode(models.Model):
	id = models.CharField(max_length=16, primary_key=True, editable=False)
	series = models.ForeignKey(Series, on_delete=models.CASCADE, related_name='episodes')
	season_number = models.IntegerField(default=-1)
	episode_number = models.IntegerField(default=-1)

class EpisodeRating(models.Model):
	episode = models.ForeignKey(Episode, on_delete=models.CASCADE, related_name='ratings')
	average_rating = models.FloatField(default=-1.0)
	num_votes = models.IntegerField(default=-1)


class EpisodeName(models.Model):
	episode = models.ForeignKey(Episode, on_delete=models.CASCADE, related_name='names')
	primary_name = models.CharField(max_length=200)
	original_name = models.CharField(max_length=200)
