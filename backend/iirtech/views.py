from django.shortcuts import render
from django.http import HttpResponse
from iirtech.models import QuestionType
import json, random
from django.contrib.staticfiles.templatetags.staticfiles import static
import os, uuid
import jpype

# Korean parser
from . import korean_parsing
from . import korean_analyzer
from .vocab_extractor import extract_vocab
from .vocab_extractor import Papago

from .hanspell import spell_checker
from .find_similar import match_nouns

STATIC_PATH = './backend/static/'

lines = open(static('travel.txt')).readlines()
# lines = open(static('scenario.txt')).readlines()
users = {}
bot_list = []
class Bot():
    def __init__(self):
        self.index = 0
        self.lines = lines
        self.id = str(uuid.uuid4())
        self.tense = None
        self.replace_pairs = []

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
            line.append(self.replace_words(curr_line))
            self.index += 1
            if self.index < len(self.lines):
                curr_line = self.lines[self.index]
            else:
                line.append(False)
        if self.index < len(self.lines):
            user_line = self.lines[self.index]
        else:
            user_line = ""
        return line, user_line

    def current_line(self):
        return self.lines[self.index]
    
    def replace_words(self, line):
        new_line = line
        for x in self.replace_pairs:
            new_line = new_line.replace(x[1], x[0])
        return new_line
    

def chooseTense(request):
    _tense = str(request.GET['tense'])
    _userid = str(request.GET['userid'])
    bot = users[_userid]
    bot.tense = _tense
    js = {
        "tense": _tense
    }
    return HttpResponse(json.dumps(js), content_type="application/json")

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
            (int) type: 0 - bot, 1 - question, 2 - user, 3 - end, 4 - init
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
            "type": 4,
            "success": 1,
            "userid": _userid,
            "nextline": "",
            "original": _text,
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
        corrected_result = spell_checker.check(_text).as_dict()
        num_errors = corrected_result['errors']
        correct_sent = []

        for x in corrected_result['words']:
            correct_sent.append((x, corrected_result['words'][x]))
            # if corrected_result['words'][x] == 0:
            #     correct_sent += "<span>" + x + " </span>"
            # elif corrected_result['words'][x] == 1:
            #     correct_sent += "<span className='redFont'>" + x + " </span>"
            # elif corrected_result['words'][x] == 2:
            #     correct_sent += "<span className='greenFont'>" + x + " </span>"
            # elif corrected_result['words'][x] == 3:
            #     correct_sent += "<span className='purpleFont'>" + x + " </span>"
            # elif corrected_result['words'][x] == 4:
            #     correct_sent += "<span className='blueFont'>" + x + " </span>"
        userline = bot.lines[bot.index]
        ul_s = userline.split('(')
        n_list = []
        for x in ul_s:
            if ')' in x:
                n_list.append(x[:x.index(')')])
        print(n_list)

        if jpype.isJVMStarted():
            jpype.attachThreadToJVM()
        
        bot.replace_pairs.extend(match_nouns(n_list, _text))
        
        msg, next_line = bot.next_line()
        msg = process_msg(msg, bot.tense)
        
        if msg[-1] == False:
            js = {
                "text": msg[:-1],
                "type": 3,
                "success": 1,
                "userid": _userid,
                "nextline": next_line,
                "original": _text,
                "errorcount": num_errors,
                "corrected": correct_sent,
            }
        else:
            js = {
                "text": msg,
                "type": 0,
                "success": 1,
                "userid": _userid,
                "nextline": next_line,
                "original": _text,
                "errorcount": num_errors,
                "corrected": correct_sent,
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
        if choice == 'p':
            processed.append(korean_parsing.make_past(line_s))
        elif choice == 'f':
            processed.append(future)
    return processed

def fetchActivity(request):
    response = extract_vocab('../static/travel.txt')
    js = {'response': []}
    random.shuffle(response['A'])
    for v in response['A']:
        if len(v[0])>1:
            options = []
            options.append(v[1])
            while len(options)<3:
                candidate = random.choice(response['translated'])
                if candidate != v[1]:
                    options.append(candidate)
            random.shuffle(options)
            js['response'].append({
                'type': 'v',
                'lang': 'kor',
                'content': v[0],
                'options': options,
                'correct': options.index(v[1]),
            })
    for v in response['B']:
        if len(v[0])>1:
            options = []
            options.append(v[1])
            while len(options)<3:
                candidate = random.choice(response['translated'])
                if candidate != v[1]:
                    options.append(candidate)
            random.shuffle(options)
            js['response'].append({
                'type': 'v',
                'lang': 'kor',
                'content': v[0],
                'options': options,
                'correct': options.index(v[1]),
            })
    for v in response['C']:
        if len(v[0])>1:
            options = []
            options.append(v[1])
            while len(options)<3:
                candidate = random.choice(response['translated'])
                if candidate != v[1]:
                    options.append(candidate)
            random.shuffle(options)
            js['response'].append({
                'type': 'v',
                'lang': 'kor',
                'content': v[0],
                'options': options,
                'correct': options.index(v[1]),
            })
    return HttpResponse(json.dumps(js), content_type="application/json")

def translateToKorean(request):
    _text = str(request.GET['text'])
    translated = Papago('nmt', _text, 'ko')
    js = {
        'translatedText': translated,
    }
    return HttpResponse(json.dumps(js), content_type="application/json")