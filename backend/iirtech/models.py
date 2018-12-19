from django.db import models

# Create your models here.
class QuestionType(models.Model):
    questionType = models.IntegerField()
    questionID = models.IntegerField()
    dialogueIndex = models.IntegerField()

class Filename(models.Model):
    filename = models.TextField()
    topic = models.TextField()

class VocabList(models.Model):
    filename = models.ForeignKey(Filename, on_delete=models.CASCADE)
    word = models.TextField()
    translated = models.TextField()
    level = models.TextField()