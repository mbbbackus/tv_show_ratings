from rest_framework import serializers
from .models import Series, Episode, EpisodeName, EpisodeRating


class EpisodeRatingSerializer(serializers.ModelSerializer):
	class Meta:
		model = EpisodeRating
		fields = (
			'average_rating',
			'num_votes'
		)

class EpisodeNameSerializer(serializers.ModelSerializer):
	class Meta:
		model = Episode
		fields = (
			'primary_name', 
			'original_name', 
		)

class EpisodeSerializer(serializers.ModelSerializer):
	names = EpisodeNameSerializer(many=True, read_only=True)
	ratings = EpisodeRatingSerializer(many=True, read_only=True)

	class Meta:
		model = Episode
		fields = (
			'id', 
			'primary_title', 
			'original_title', 
			'start_year', 
			'end_year'
			'names',
			'ratings'
		)

class SeriesSerializer(serializers.ModelSerializer):
	episodes = EpisodeSerializer(many=True, read_only=True)

	class Meta:
		model = Series
		fields = (
			'id', 
			'primary_title', 
			'original_title', 
			'start_year', 
			'end_year',
			'episodes'
		)


