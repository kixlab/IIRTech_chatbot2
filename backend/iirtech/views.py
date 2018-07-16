from django.shortcuts import render
from django.http import HttpResponse
from iirtech.models import QuestionType
import json
from django.contrib.staticfiles.templatetags.staticfiles import static
import os, uuid

STATIC_PATH = './backend/static/'

lines = open(static('scenario.txt')).readlines()

class Bot():
    def __init__(self):
        self.index = 0
        self.lines = lines
        self.id = str(uuid.uuid4())
    
    def next_line(self):
        line = self.lines[self.index]
        self.index += 1
        return line

# Create your views here.
def fetchMessage(request):
    """
        input: POST

            (str) text: message
            (int) type: 0 - initialize, 1 - question, 2 - normal message
            (int) index: -1 - initialize and question type, 0 - normal message
            (str) userid: id

        return: JSON

            (str) text: message 
            (int) type: 0 - initialize, 1 - question, 2 - normal message
            (int) success: 0 - fail, 1 - success
            (str) userid: id

    """
    _type = int(request.GET['type'])
    if _type == 0:
        bot = Bot()
        msg = bot.lines[bot.index]
        userid = bot.id
        js = {
            "text": msg,
            "type": 0,
            "success": 1,
            "userid": userid
        }
    elif _type == 1:
        js = {}
    else:
        msg = request.GET['text']
        js = {}
    
    return HttpResponse(json.dumps(js), content_type="application/json")

def returnQuestion(request):
    """

       input: JSON



       return: JSON



    """

    js = {'success': 'success'}
    return HttpResponse(json.dumps(js), content_type="application/json")