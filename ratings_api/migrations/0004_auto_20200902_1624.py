# Generated by Django 3.0.7 on 2020-09-02 16:24

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('ratings_api', '0003_auto_20200807_2006'),
    ]

    operations = [
        migrations.AlterField(
            model_name='episode',
            name='id',
            field=models.CharField(editable=False, max_length=16, primary_key=True, serialize=False),
        ),
        migrations.AlterField(
            model_name='series',
            name='id',
            field=models.CharField(editable=False, max_length=16, primary_key=True, serialize=False),
        ),
    ]
