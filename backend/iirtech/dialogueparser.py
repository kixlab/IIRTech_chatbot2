# -*- coding:utf-8 -*-

import argparse, os, json, sys, urllib.request, pandas
from nltk import sent_tokenize, word_tokenize, pos_tag
from konlpy.tag import Kkma
from konlpy.tag import Mecab
from math import isnan

parser = argparse.ArgumentParser()
parser.add_argument('txtfile', help='single sentence per line')
args = parser.parse_args()

vocab_list = []
rank = {}

df = pandas.read_excel('vocab.xls')

rank = [int(r) if not isnan(r) else 6000 for r in df['순위']]
vocab_list = [str(w).strip() for w in df['단어']]
grade = [str(g).strip() for g in df['등급']]
grade_set = list(set(grade))
# for g in grade_set:
#     rank[g] = []

# for idx, val in enumerate(vocab_list):
#     g = grade[idx]
#     rank[g] = val
            

except IOError:
    print ('"%s" is not found.' %args.txtfile)