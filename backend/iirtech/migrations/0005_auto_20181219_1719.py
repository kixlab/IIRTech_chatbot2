# Generated by Django 2.1 on 2018-12-19 08:19

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('iirtech', '0004_auto_20181219_1705'),
    ]

    operations = [
        migrations.RemoveField(
            model_name='filename',
            name='id',
        ),
        migrations.AlterField(
            model_name='filename',
            name='filename',
            field=models.TextField(primary_key=True, serialize=False),
        ),
    ]
