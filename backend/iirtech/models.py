from django.db import models

# Create your models here.
class QuestionType(models.Model):
    questionType = models.IntegerField()
    questionID = models.IntegerField()
    dialogueIndex = models.IntegerField()