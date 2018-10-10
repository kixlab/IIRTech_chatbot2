from django.shortcuts import render
from django.http import HttpResponse
from iirtech.models import QuestionType
import json
from django.contrib.staticfiles.templatetags.staticfiles import static
import os, uuid
import jpype

# Korean parser
from . import korean_parsing
from . import korean_analyzer

STATIC_PATH = './backend/static/'

lines = open(static('sample_convo.txt')).readlines()
users = {}

class Bot():
    def __init__(self):
        self.index = 0
        self.lines = lines
        self.id = str(uuid.uuid4())
        self.tense = 1

    def next_line(self):
        self.index += 1
        line = []
        if self.index >= len(self.lines):
            return False
        curr_line = self.lines[self.index]
        while not 'b' in curr_line[1:curr_line.find('>')] and self.index < len(self.lines):
            self.index += 1
            curr_line = self.lines[self.index]
        while 'b' in curr_line[1:curr_line.find('>')] and self.index < len(self.lines):
            line.append(curr_line)
            self.index += 1
            if self.index < len(self.lines):
                curr_line = self.lines[self.index]
            else:
                line.append(False)
        return line

    def current_line(self):
        return self.lines[self.index]

# Create your views here.
def fetchMessage(request):
    """

        input: GET

            (str) text: message
            (int) type: 0 - initialize, 1 - question, 2 - normal message, 3 - end session
            (int) index: -1 - initialize, 0 - normal message, 1 - 어휘, 2 - 문법, 3 - 발음, 4 - 기타
            (str) userid: id

        return: JSON

            (str) text: list of messages
            (int) type: 0 - bot, 1 - question, 2 - user
            (int) success: 0 - fail, 1 - success
            (str) userid: id

    """
    _text = str(request.GET['text'])
    _type = int(request.GET['type'])
    _userid = str(request.GET['userid'])
    
    # Initialize Bot
    if _type == 0:
        bot = Bot()
        msg = [bot.lines[bot.index]]
        _userid = bot.id
        users[_userid] = bot
        js = {
            "text": msg,
            "type": 0,
            "success": 1,
            "userid": _userid
        }
    else:
        bot = users[_userid]
    
    _index = int(request.GET['index'])
        
    if _type == 2:
        _questionType = ["어휘","문법","발음","기타"]
        line = bot.current_line()
        words = line.split()
        word = words[int(_text)]
        _questiontype = _index-1
        q = QuestionType(questionType=_questiontype,questionID=int(_text),dialogueIndex=bot.index)
        q.save()
        msg = bot.next_line()
        if msg[-1] == False:
            js = {
                "text": [""],
                "type": 3,
                "success": 1,
                "userid": _userid
            }
        else:
            js = {
                "text": msg,
                "type": 0 if (bot.index-1)%2==0 else 2,
                "success": 1,
                "userid": _userid
            }
    elif _type == 1:
        msg = bot.next_line()
        msg = process_msg(msg, bot.tense)
        if msg[-1] == False:
            js = {
                "text": msg[:-1],
                "type": 3,
                "success": 1,
                "userid": _userid
            }
        else:
            js = {
                "text": msg,
                "type": 0,
                "success": 1,
                "userid": _userid
            }

    return HttpResponse(json.dumps(js), content_type="application/json")

def returnQuestion(request):
    """

       input: JSON

       return: JSON

    """

    js = {'success': 'success'}
    return HttpResponse(json.dumps(js), content_type="application/json")

def process_msg(msgs, choice):
    if jpype.isJVMStarted():
        jpype.attachThreadToJVM()
    processed = []
    for msg in msgs:
        if msg == False:
            processed.append(False)
            break
        line_s = msg.strip()
        tags = line_s[1:line_s.find('>')]
        line_s = line_s[line_s.find('>')+1:]
        if line_s[0] == '#':
            continue
        if line_s[0] == '{': #choice variable
            processed.append(line_s)
            continue
        if line_s[0] == '[':
            processed.append(line_s[1:-1])
            continue
        # print(line_s[1:])
        if 'g' in tags: #추측 미래 시제
            future = korean_parsing.make_future_guess(line_s)
        else: #의지 미래 시제
            future = korean_parsing.make_future_will(line_s)
        if choice == 1:
            processed.append(korean_parsing.make_past(line_s))
        elif choice == 2:
            processed.append(future)
    return processed