# Generated by Django 2.1 on 2018-10-26 10:02

from django.db import migrations, models
import django.db.models.deletion


class Migration(migrations.Migration):

    dependencies = [
        ('iirtech', '0001_initial'),
    ]

    operations = [
        migrations.CreateModel(
            name='Filename',
            fields=[
                ('id', models.AutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('filename', models.TextField()),
            ],
        ),
        migrations.CreateModel(
            name='VocabList',
            fields=[
                ('id', models.AutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('word', models.TextField()),
                ('translated', models.TextField()),
                ('level', models.TextField()),
                ('filename', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to='iirtech.Filename')),
            ],
        ),
    ]
