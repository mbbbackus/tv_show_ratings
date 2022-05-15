from rest_framework import serializers
from .models import Series, Episode, Actor, Appearance

class EpisodeSerializer(serializers.ModelSerializer):
	names = EpisodeNameSerializer(many=True, read_only=True)
	ratings = EpisodeRatingSerializer(many=True, read_only=True)

	class Meta:
		model = Episode
		fields = (
			'id', 
			'season_number',
			'episode_number',
			'primary_name',
			'average_rating',
			'num_votes'
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

class ActorSerializer(serializers.ModelSerializer):

	class Meta:
		model = Actor
		fields = (
			'primary_name',
			'birth_year',
			'death_year',
			'primary_profession',
			'known_for'
		)

class AppearanceSerializer(serializers.ModelSerializer):
	actor = ActorSerializer(many=False, read_only=True)

	class Meta:
		model = Appearance
		fields = (
			'ordering',
			'actor',
			'job',
			'characters'
		)

class EpisodeAppearancesSerializer(serializers.ModelSerializer):
	names = EpisodeNameSerializer(many=True, read_only=True)
	appearances = AppearanceSerializer(many=True, read_only=True)

	class Meta:
		model = Episode
		fields = (
			'id', 
			'season_number',
			'episode_number',
			'names',
			'appearances'
		)

class SeriesAppearancesSerializer(serializers.ModelSerializer):
	episodes = EpisodeAppearancesSerializer(many=True, read_only=True)

	class Meta:
		model = Series
		fields = (
			'episodes',
		)



