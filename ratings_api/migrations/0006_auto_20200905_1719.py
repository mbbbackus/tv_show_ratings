# Generated by Django 3.0.7 on 2020-09-05 17:19

from django.db import migrations


class Migration(migrations.Migration):

    dependencies = [
        ('ratings_api', '0005_auto_20200905_1716'),
    ]

    operations = [
        migrations.AlterModelOptions(
            name='series',
            options={'ordering': ['-popularity']},
        ),
    ]