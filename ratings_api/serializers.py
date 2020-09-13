from rest_framework import serializers
from .models import Series, Episode, EpisodeName, EpisodeRating#, Cast

# class CastSerializer(serializers.ModelSerializer):
# 	actor = serializers.CharField(read_only=True)
# 	class Meta:
# 		model = Cast
# 		fields = (
# 			'actor',
# 		)

class EpisodeRatingSerializer(serializers.ModelSerializer):
	average_rating = serializers.FloatField(read_only=True)
	num_votes = serializers.IntegerField(read_only=True)
	class Meta:
		model = EpisodeRating
		fields = (
			'average_rating',
			'num_votes',
		)

class EpisodeNameSerializer(serializers.ModelSerializer):
	primary_name = serializers.CharField(read_only=True)
	original_name = serializers.CharField(read_only=True)
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
			'season_number',
			'episode_number',
			'names',
			'ratings',
		)

class SeriesSerializer(serializers.ModelSerializer):
	episodes = EpisodeSerializer(many=True, read_only=True)

	class Meta:
		model = Series
		fields = (
			'id', 
			'primary_title', 
			'original_title', 
			'popularity',
			'start_year', 
			'end_year',
			'episodes',
		)

class SeriesSearchSerializer(serializers.ModelSerializer):

	class Meta:
		model = Series
		fields = (
			'id', 
			'primary_title', 
			'original_title', 
			'popularity',
			'start_year', 
			'end_year',
		)


