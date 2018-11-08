import argparse, os, json, sys, urllib.request, pandas
from django.contrib.staticfiles.templatetags.staticfiles import static
from konlpy.tag import Kkma
from nltk.corpus import wordnet as wn

kkma = Kkma()

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

def match_nouns(noun_list, new_sent):
    # sample_nouns = kkma.nouns(original)
    sample_nouns = noun_list
    en_sample_nouns = []
    for x in sample_nouns:
        en_sample_nouns.append(Papago('smt',x,'ko'))
        en_sample_nouns[-1] = en_sample_nouns[-1].split(" ")[-1]
    wn_sample = []
    for noun in en_sample_nouns:
        temp_list = wn.synsets(noun, wn.NOUN)
        if len(temp_list) > 0:
            wn_sample.append(temp_list)
        else:
            wn_sample.append("")

    ko_nouns = kkma.nouns(new_sent)
    en_nouns_nmt = []
    for x in ko_nouns:
        en_nouns_nmt.append(Papago('nmt',x,'ko'))
        en_nouns_nmt[-1] = ''.join(x for x in en_nouns_nmt[-1].split(" ")[-1] if x.isalpha())
    
    wn_sent = []
    for noun in en_nouns_nmt:
        temp_list = wn.synsets(noun, wn.NOUN)
        if len(temp_list) > 0:
            wn_sent.append(temp_list)
        else:
            wn_sent.append("")
    sim_words = []
    
    while len(wn_sent) > 0 and len(wn_sample) > 0:
        count = 0
        max_sim = -1
        max_sent = 0
        max_samp = 0
        for s_noun_list in wn_sample:
            if not s_noun_list is '':
                for j in range(len(wn_sent)):
                    if not wn_sent[j] is '':
                        for cand_sent in wn_sent[j]:
                            for cand_samp in s_noun_list:
                                curr_sim = wn.wup_similarity(cand_sent, cand_samp)
                                if curr_sim > max_sim:
                                    max_sim = curr_sim
                                    max_sent = j
                                    max_samp = count
            count += 1
        sim_words.append((ko_nouns[max_sent], sample_nouns[max_samp]))
        wn_sent.pop(max_sent)
        ko_nouns.pop(max_sent)
        wn_sample.pop(max_samp)
        sample_nouns.pop(max_samp)

    print(sim_words)
    return sim_words
