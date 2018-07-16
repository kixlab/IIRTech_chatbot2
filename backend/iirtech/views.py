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
        self.index = 1
        self.lines = lines
        self.id = str(uuid.uuid4())
    
    def next_line(self):
        line = self.lines[self.index]
        self.index += 1
        return line
    
    def current_line(self):
        return self.lines[self.index]

# Create your views here.
def fetchMessage(request):
    """
    
        input: POST

            (str) text: message
            (int) type: 0 - initialize, 1 - question, 2 - normal message
            (int) index: -1 - initialize, 0 - normal message, 1 - 어휘, 2 - 문법, 3 - 발음, 4 - 기타
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
        if '없음' in _text.strip():
            msg = bot.next_line()
            js = {
                "text": msg,
                "type": 0 if (bot.index-1)%2==0 else 2,
                "success": 1,
                "userid": _userid
            }
        else:
            _questionType = ["어휘","문법","발음","기타"]
            line = bot.current_line()
            words = line.split()
            word = words[int(_text)]
            _questiontype = _questionType[_index-1]
            q = QuestionType(questionType=_questiontype,questionID=int(_text),dialogueIndex=bot.index)
            q.save()
            msg = bot.next_line()
            js = {
                "text": msg,
                "type": 0 if (bot.index-1)%2==0 else 2,
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