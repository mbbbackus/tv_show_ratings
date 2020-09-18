# Generated by Django 3.0.7 on 2020-09-18 19:51

from django.db import migrations, models
import django.db.models.deletion


class Migration(migrations.Migration):

    dependencies = [
        ('ratings_api', '0007_actor_known_for'),
    ]

    operations = [
        migrations.CreateModel(
            name='Appearance',
            fields=[
                ('id', models.AutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('ordering', models.IntegerField(default=-1)),
                ('job', models.CharField(max_length=200)),
                ('characters', models.CharField(blank=True, max_length=200)),
                ('actor', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name='appearances', to='ratings_api.Actor')),
                ('episode', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name='appearances', to='ratings_api.Episode')),
            ],
        ),
        migrations.DeleteModel(
            name='Principal',
        ),
    ]