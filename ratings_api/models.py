import uuid
from django.db import models

class Series(models.Model):
	id = models.CharField(max_length=16, primary_key=True, editable=False) #tt type
	primary_title = models.CharField(max_length=200)
	original_title = models.CharField(max_length=200)
	popularity = models.IntegerField(default=-1)
	start_year = models.IntegerField(default=-1)
	end_year = models.IntegerField(default=-1) 

	class Meta:
		ordering = ['-popularity']

class Episode(models.Model):
	id = models.CharField(max_length=16, primary_key=True, editable=False) #tt type
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

class Actor(models.Model):
	id = models.CharField(max_length=16, primary_key=True, editable=False) #nm type
	primary_name = models.CharField(max_length=200)
	birth_year = models.IntegerField(default=-1)
	death_year = models.IntegerField(default=-1)
	primary_profession = models.CharField(max_length=200)

class Principal(models.Model): #principal means like a main participant/contributor
	title = models.ForeignKey(Episode, on_delete=models.CASCADE, related_name='principals') #tt type
	ordering = models.IntegerField(default=-1)
	actor = models.ForeignKey(Actor, on_delete=models.CASCADE, related_name='principals') #nm type
	category = models.CharField(max_length=200)
	job = models.CharField(max_length=200)
	characters = models.CharField(max_length=200, blank=True) #convert arrays to json strings











