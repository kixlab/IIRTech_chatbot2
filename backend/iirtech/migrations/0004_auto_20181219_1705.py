# Generated by Django 2.1 on 2018-12-19 08:05

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('iirtech', '0003_filename_topic'),
    ]

    operations = [
        migrations.AlterField(
            model_name='vocablist',
            name='filename',
            field=models.TextField(),
        ),
    ]
