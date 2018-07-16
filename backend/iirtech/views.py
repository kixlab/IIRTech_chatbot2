from django.shortcuts import render
from django.http import HttpResponse
from iirtech.models import QuestionType
import json
from django.contrib.staticfiles.templatetags.staticfiles import static
import os, uuid

STATIC_PATH = './backend/static/'

lines = open(static('scenario.txt')).readlines()
users = {}

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
            (int) type: 0 - bot, 1 - question, 2 - user
            (int) success: 0 - fail, 1 - success
            (str) userid: id

    """
    _text = str(request.GET['text'])
    _type = int(request.GET['type'])
    _userid = str(request.GET['userid'])
    if _userid:
        bot = users[_userid]
    _index = int(request.GET['index'])
    if _type == 0:
        bot = Bot()
        msg = bot.lines[bot.index]
        _userid = bot.id
        users[_userid] = bot
        js = {
            "text": msg,
            "type": 0,
            "success": 1,
            "userid": _userid
        }
    elif _type == 1:
        print (_text)
        if _text.strip == '없음':
            msg = bot.next_line()
            js = {
                "text": msg,
                "type": 2,
                "success": 1,
                "userid": _userid
            }
        else:
            msg = "Type of question received was %s" %_text
            js = {
                "text": msg,
                "type": 1,
                "success": 1,
                "userid": _userid
            }
        
    else:
        msg = request.GET['text']
        js = {
            "text": msg,
            "type": 1,
            "success": 1,
            "userid": userid
        }
    
    return HttpResponse(json.dumps(js), content_type="application/json")

def returnQuestion(request):
    """

       input: JSON



       return: JSON



    """

    js = {'success': 'success'}
    return HttpResponse(json.dumps(js), content_type="application/json")