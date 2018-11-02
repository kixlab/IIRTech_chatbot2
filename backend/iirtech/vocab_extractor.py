from konlpy.tag import Mecab
from django.contrib.staticfiles.templatetags.staticfiles import static
import json, urllib
import pandas as pd
from iirtech.models import VocabList, Filename
import os

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

# def POS(nmt,smt):
#     tokenized_text_nmt = word_tokenize(nmt)
#     tokenized_text_smt = word_tokenize(smt)
#     tags_nmt = [p[0] for p in pos_tag(tokenized_text_nmt) if p[1][0] == 'N' or p[1][0] == 'V']
#     tags_smt = [p[0] for p in pos_tag(tokenized_text_smt) if p[1][0] == 'N' or p[1][0] == 'V']
#     return [tags_nmt,tags_smt]

# def koreanPOS(text):
#     mecab_noun = ['NNG']
#     mecab_verb = ['VV']
#     mecab_adj = ['VA']
#     mecab_eomi = ['EP','EF','EC', 'ETN', 'ETM']
#     mecab_josa = ['JKS', 'JKC', 'JKG', 'JKO', 'JKB', 'JKV', 'JKQ', 'JC']
#     mecab_noun = ['NNG']
#     kkma_noun = ['NNG']
#     kkma_verb = ['VV']
#     kkma_adj = ['VA']
#     kkma_eomi = ['EPH','EPT','EPP','EFN','EFQ','EFO','EFA','EFI','EFR','ECE','ECD','ECS','ETN','ETD']
#     kkma_josa = ['JKS','JKC','JKG','JKO','JKM','JKI','JKQ']
#     kkma = Kkma()
#     mecab = Mecab()
#     kkma_pos = kkma.pos(text)
#     print("Mecab Noun:", [p[0] for p in mecab.pos(text) if p[1] in mecab_noun])
#     print("Kkma Noun:", [p[0] for p in kkma_pos if p[1] in kkma_noun])
#     print("Mecab Verb:",[x for x in [p[0] if p[1] in mecab_verb else p[0] if len(p[1].split('+'))>1 and 'VV' in p[1].split('+') else None for p in mecab.pos(text)] if x ])
#     print("Kkma Verb:", [p[0] for p in kkma_pos if p[1] in kkma_verb])
#     print("Mecab Adj:", [p[0] for p in mecab.pos(text) if p[1] in mecab_adj])
#     print("Kkma Adj:", [p[0] for p in kkma_pos if p[1] in kkma_adj])
#     print("Mecab Eomi:",[p[0] for p in mecab.pos(text) if p[1] in mecab_eomi])
#     print("Kkma Eomi:", [p[0] for p in kkma_pos if p[1] in kkma_eomi])
#     print("Mecab Josa:",[p[0] for p in mecab.pos(text) if p[1] in mecab_josa])
#     print("Kkma Josa:", [p[0] for p in kkma_pos if p[1] in kkma_josa])
#     mecab_pos = [p[0] for p in mecab.pos(text) if p[1][0] == 'N' or p[1][0] == 'V']
#     kkma_pos = [p[0] for p in kkma.pos(text) if p[1][0] == 'N' or p[1][0] == 'V']
#     return [kkma_pos, mecab_pos]

mecab = Mecab()
lines = []

def extract_vocab(txtfile=static('scenario.txt')):
    fname = os.path.basename(txtfile)
    filename, created = Filename.objects.get_or_create(
        filename=fname
    )
    vocab_from_dialogue_by_level = {'A':[],'B':[],'C':[],'translated':[]}
    if created:
        with open(static(txtfile)) as f:
            lines = f.readlines()

        re = pd.read_excel(static('vocab_list.xls'))
        vocab_list = re['단어']
        level_list = re['등급']
        list_length = len(vocab_list)
        
        vocab_by_level = {'A':[],'B':[],'C':[]}
        for i in range(list_length):
            vocab_by_level[level_list[i]].append(''.join([s for s in vocab_list[i] if not s.isdigit()]))
        
        vocab = set()
        for line in lines:
            for n in mecab.nouns(line):
               vocab.add(n)

        count = 0
        for v in vocab:
            v = v.lower()
            translated = Papago('nmt',v,'ko')
            level = ''
            if v in vocab_by_level['A']:
                level = 'A'
                vocab_from_dialogue_by_level['A'].append((v,translated))
            elif v in vocab_by_level['B']:
                level = 'B'
                vocab_from_dialogue_by_level['B'].append((v,translated))
            elif v in vocab_by_level['C']:
                level = 'C'
                vocab_from_dialogue_by_level['C'].append((v,translated))
            v, created = VocabList.objects.get_or_create(
                filename=filename,
                word=v,
                translated=translated.strip().lower(),
                level=level
            )   
            vocab_from_dialogue_by_level['translated'].append(translated)
    else:
        vList = VocabList.objects.filter(filename=filename)
        vList_levelA = vList.filter(level='A')
        for v in vList_levelA:
            vocab_from_dialogue_by_level['A'].append((v.word,v.translated))
        vList_levelB = vList.filter(level='B')
        for v in vList_levelB:
            vocab_from_dialogue_by_level['B'].append((v.word,v.translated))
        vList_levelC = vList.filter(level='C')
        for v in vList_levelC:
            vocab_from_dialogue_by_level['C'].append((v.word,v.translated))
        for v in vList:
            vocab_from_dialogue_by_level['translated'].append(v.translated)
    return vocab_from_dialogue_by_level
#     print (Papago('smt',v,'ko'),v)