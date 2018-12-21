from konlpy.tag import Mecab
from django.contrib.staticfiles.templatetags.staticfiles import static
import json, urllib
import pandas as pd
from iirtech.models import VocabList, Filename
import os
from nltk import pos_tag, word_tokenize

with open(static('apiKeys.json')) as apiKeys:
    js = json.load(apiKeys)
    client_id = js['client_id']
    client_secret = js['client_secret']

def Papago(model, text, sl):
    if model == 'nmt':
        url = "https://openapi.naver.com/v1/papago/n2mt"
    else:
        url = "https://openapi.naver.com/v1/language/translate"
    if sl == 'ko':
        data = "source=ko&target=en&text=" + text
    else:
        data = "source=en&target=ko&text=" + text
    request = urllib.request.Request(url)
    request.add_header("X-Naver-Client-Id",client_id)
    request.add_header("X-Naver-Client-Secret",client_secret)
    response = urllib.request.urlopen(request, data=data.encode("utf-8"))
    rescode = response.getcode()
    if rescode == 200:
        response_body = response.read()
        return json.loads(response_body.decode('utf-8'))['message']['result']['translatedText']
    else:
        return "Error Code:" + rescode

mecab = Mecab()
lines = []

def extract_vocab(txtfile=static('sample_convo.txt'), lines=''):
    # filename, created = Filename.objects.get_or_create(
    #     filename=txtfile
    # )
    vocab_from_dialogue_by_level = {'words':[],'translated':[]}
    vList = VocabList.objects.filter(filename=txtfile)
    for v in vList:
        vocab_from_dialogue_by_level['words'].append((v.word,v.translated.lower()))
    for v in vList:
        vocab_from_dialogue_by_level['translated'].append(v.translated.lower())
    vocab_from_dialogue_by_level['words'] = vocab_from_dialogue_by_level['words']
    vocab_from_dialogue_by_level['translated'] = vocab_from_dialogue_by_level['translated']
    return vocab_from_dialogue_by_level
#     print (Papago('smt',v,'ko'),v)