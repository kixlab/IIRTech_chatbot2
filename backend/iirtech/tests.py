from django.test import TestCase
# Create your tests here.
from konlpy.tag import Kkma
from konlpy.tag import Mecab
from konlpy.utils import pprint
kkma = Kkma()
mecab = Mecab()
script = open('/Users/kyungjejo/Documents/git_clone/IIRTech_chatbot2/backend/static/scenario.txt').readlines()

for line in script[:11]:
    print(line,)
    print(mecab.nouns(line))
    print([x[0]+"다" for x in mecab.pos(line) if x[1] == 'VV'])
    print([x[0] for x in mecab.pos(line) if 'EF' in x[1]])
    print(mecab.pos(line))
    # print([x for x in kkma.pos(line) if x[1] == 'VV' or x[1][:2] == 'NN'])

scenario = open('/Users/kyungjejo/Documents/git_clone/IIRTech_chatbot2/backend/static/dramascript.txt').readlines()
for line in scenario[:11]:
    print(line,)
    print(mecab.nouns(line))
    print([x[0]+"다" for x in mecab.pos(line) if x[1] == 'VV'])
    print([x[0] for x in mecab.pos(line) if 'EF' in x[1]])
    print(mecab.pos(line))