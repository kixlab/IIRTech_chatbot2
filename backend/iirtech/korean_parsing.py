'''
Code based on Kkma nlp pos tagger. Aug 2018
'''
import os
import sys
from konlpy.tag import Komoran
from konlpy.tag import Mecab
from konlpy.tag import Kkma
from konlpy.tag import Hannanum
from konlpy.tag import Okt

from . import korean_analyzer

from django.contrib.staticfiles.templatetags.staticfiles import static

STATIC_PATH = './backend/static/'

kkma = Kkma()
mecab = Mecab()
komoran = Komoran()
#hannanum = Hannanum()
okt = Okt()

# -*- coding: utf-8 -*-

consonants = ['ㄱ', 'ㄲ', 'ㄳ', 'ㄴ', 'ㄵ', 'ㄶ', 'ㄷ', 'ㄸ',
        'ㄹ', 'ㄺ', 'ㄻ', 'ㄼ', 'ㄽ', 'ㄾ', 'ㄿ', 'ㅀ',
        'ㅁ', 'ㅂ', 'ㅃ', 'ㅄ', 'ㅅ', 'ㅆ', 'ㅇ', 'ㅈ',
        'ㅉ', 'ㅊ', 'ㅋ', 'ㅌ', 'ㅍ', 'ㅎ']

jongsung = ['ㄱ', 'ㄲ', 'ㄳ', 'ㄴ', 'ㄵ', 'ㄶ', 'ㄷ',
        'ㄹ', 'ㄺ', 'ㄻ', 'ㄼ', 'ㄽ', 'ㄾ', 'ㄿ', 'ㅀ',
        'ㅁ', 'ㅂ', 'ㅄ', 'ㅅ', 'ㅆ', 'ㅇ', 'ㅈ',
        'ㅊ', 'ㅋ', 'ㅌ', 'ㅍ', 'ㅎ']

def detect_last_verb(sentence):
    s_list = analyze_kkma(sentence)
    last_idx = -1
    sub_count = 0
    for i in range(len(s_list)):
        if 'ETD' in s_list[i] and s_list[i][0] in consonants:
            sub_count += 1
        if 'VV' in s_list[i] or 'VA' in s_list[i] or 'VXV' in s_list[i] or 'VXA' in s_list[i] or 'VCP' in s_list[i] or 'XSV' in s_list[i]:
            last_idx = i
    if last_idx != -1:
        return last_idx - sub_count
    else:
        return None

def find_spaces(sentence):
    if(sentence.find(" ") != -1):
        space_list = [sentence.find(" ")]
    else:
        return []
    while(sentence.find(" ", space_list[-1] + 1) != -1):
        space_list.append(sentence.find(" ", space_list[-1] + 1))
    return space_list
                          

def make_past(sentence):
    s_list = analyze_kkma(sentence)
    new_sent = []
    for pos in s_list:
        if pos[1] == 'EPT':
            continue
        new_sent.append(pos[0])
        if new_sent[-1] == 'ㅂ니다':
            new_sent[-1] = '습니다'
        if new_sent[-1] == 'ㄹ까요':
            new_sent[-1] = '을까요'
        if new_sent[-1][0] == 'ㅂ':
            new_sent[-1] = '습' + new_sent[-1][1:]
        if new_sent[-1][0] == 'ㄹ':
            new_sent[-1] = '을' + new_sent[-1][1:]
        if pos[1] == 'EFN': #평서형 종결 어미에 자음만 분리 되었을 경우
            for consonant in consonants:
                cons_pos = new_sent[-1].find(consonant)
                if cons_pos != -1:
                    update_sent = list(new_sent[-1])
                    update_sent.pop(cons_pos)
                    update_sent = ''.join(update_sent)
                    new_sent[-1] = update_sent
            
        if pos[1] == 'ETD' and pos[0] in jongsung: #~ㄴ, ~ㄹ 결합
            new_sent.pop()
            batchim_add = jongsung.index(pos[0])+1
            new_sent[-1] = new_sent[-1][:-1] + chr(ord(korean_analyzer.remove_batchim(new_sent[-1][-1])) + batchim_add)

        if pos[1] == 'ECD' or pos[1] == 'ECS':
            if pos[0][0] == '아':
                if korean_analyzer.is_ah(new_sent[-2][-1]):
                    new_sent[-1] = new_sent[-1][1:]
                elif korean_analyzer.is_eu(new_sent[-2][-1]):
                    new_sent[-2] = new_sent[-2][:-1]
            elif pos[0] == '어서' or pos[0] == '어':
                if new_sent[-2][-1] == '하':
                    new_sent[-2] = new_sent[-2][:-1] + '해'
                    new_sent[-1] = new_sent[-1][1:]
                elif new_sent[-2][-1] == '되':
                    new_sent[-2] = new_sent[-2][:-1] + '돼'
                    new_sent[-1] = new_sent[-1][1:]
                    
    last_idx = detect_last_verb(sentence)
    if last_idx == None:
            return "No verb found"

    skip = False
    
    if korean_analyzer.is_eu(new_sent[last_idx][-1]) or korean_analyzer.is_oo(new_sent[last_idx][-1]):
        skip = True
        if len(new_sent[last_idx]) == 1: #단음절일 경우 자음 + 었
            if korean_analyzer.is_oo(new_sent[last_idx]): #ㅜ 일 경우 웠으로 변경
                new_sent[last_idx] = chr((ord(new_sent[last_idx])-0xAC00) // 588 * 588 + 0xAD9C)
            else:
                new_sent[last_idx] = chr((ord(new_sent[last_idx])-0xAC00) // 588 * 588 + 0xAC84)
        elif ord(new_sent[last_idx][-1]) >= 0xB77C and ord(new_sent[last_idx][-1]) < 0xB9C8: #ㄹ일 경우
            if not korean_analyzer.has_batchim(new_sent[last_idx][-2]): #받침이 없을 경우
                if not korean_analyzer.is_ahoh(new_sent[last_idx][-2]): #ㅏ 나 ㅗ 가 아닐 경우
                    new_sent[last_idx] = new_sent[last_idx][:-2] + chr(ord(new_sent[last_idx][-2]) + 8) + '렀'
                else:
                    new_sent[last_idx] = new_sent[last_idx][:-2] + chr(ord(new_sent[last_idx][-2]) + 8) + '랐'
            else:
                if not korean_analyzer.is_ahoh(new_sent[last_idx][-2]): #ㅏ 나 ㅗ 가 아닐 경우
                    new_sent[last_idx] = new_sent[last_idx][:-1] + '렀'
                else:
                    new_sent[last_idx] = new_sent[last_idx][:-1] + '랐'
        else:
            if not korean_analyzer.is_ahoh(new_sent[last_idx][-2]):
                new_sent[last_idx] = new_sent[last_idx][:-1] + chr((ord(new_sent[last_idx][-1])-0xAC00) // 588 * 588 + 0xAC84)
                if new_sent[last_idx+1] == '아요':
                    new_sent[last_idx+1] = '어요'
            else:
                new_sent[last_idx] = new_sent[last_idx][:-1] + chr((ord(new_sent[last_idx][-1])-0xAC00) // 588 * 588 + 0xAC14)
        
    if not skip:
        
        if korean_analyzer.is_ah(new_sent[last_idx][-1]): #아, 애 -> 았, 앴
            new_sent[last_idx] = new_sent[last_idx][:-1] + korean_analyzer.add_ss(new_sent[last_idx][-1])
            if new_sent[last_idx+1] == '아요':
                new_sent[last_idx+1] = '어요'
        elif korean_analyzer.is_ahoh(new_sent[last_idx][-1]):
            if korean_analyzer.is_oh(new_sent[last_idx][-1]): #ㅗ 일 경우 왔으로 변경
                new_sent[last_idx] = new_sent[last_idx][:-1] + chr((ord(new_sent[last_idx][-1])-0xAC00) // 588 * 588 + 0xAD10)
                if new_sent[last_idx+1] == '아요':
                    new_sent[last_idx+1] = '어요'
            else:
                if new_sent[last_idx+1] == '아요':
                    new_sent[last_idx+1] = '어요'
                new_sent.insert(last_idx + 1, '았') 
        elif korean_analyzer.is_yi(new_sent[last_idx][-1]) and ((len(new_sent[last_idx]) > 1 and not korean_analyzer.has_batchim(new_sent[last_idx][-1])) or (len(new_sent[last_idx]) == 1 and not korean_analyzer.has_batchim(new_sent[last_idx-1][-1]))): #이 -> 였 (no batchim)
            new_sent[last_idx] = new_sent[last_idx][:-1] + chr(ord(korean_analyzer.remove_batchim(new_sent[last_idx][-1])) - 0x174)
            if new_sent[last_idx+1] == '에요':
                new_sent[last_idx+1] = '어요'
        else:
            if new_sent[last_idx+1] == '에요':
                new_sent[last_idx+1] = '어요'
            new_sent.insert(last_idx + 1, '었')
    

    final_sent = list(''.join(new_sent))
    
    for idx in find_spaces(sentence):
        final_sent.insert(idx, " ")
    
    return ''.join(final_sent)

def make_future_will(sentence):
    s_list = analyze_kkma(sentence)
    new_sent = []
    for pos in s_list:
        if pos[1] == 'EPT':
            continue
        new_sent.append(pos[0])
        if new_sent[-1] == 'ㅂ니다' or new_sent[-1] == '습니다':
            new_sent[-1] = ' 것입니다'
        if new_sent[-1] == 'ㄹ까요' or new_sent[-1] == '일까요':
            new_sent[-1] = ' 건가요'
        if new_sent[-1] == '나요':
            new_sent[-1] = ' 건가요'
        if new_sent[-1] == 'ㅂ니까':
            new_sent[-1] = ' 겁니까'
        '''
        if new_sent[-1][0] == 'ㅂ':
            new_sent[-1] = '습' + new_sent[-1][1:]
        if new_sent[-1][0] == 'ㄹ':
            new_sent[-1] = '을' + new_sent[-1][1:]
        '''
        if pos[1] == 'EFN': #평서형 종결 어미에 자음만 분리 되었을 경우
            for consonant in consonants:
                cons_pos = new_sent[-1].find(consonant)
                if cons_pos != -1:
                    update_sent = list(new_sent[-1])
                    update_sent.pop(cons_pos)
                    update_sent = ''.join(update_sent)
                    new_sent[-1] = update_sent
            
        if pos[1] == 'ETD' and pos[0] in jongsung: #~ㄴ, ~ㄹ 결합
            new_sent.pop()
            batchim_add = jongsung.index(pos[0])+1
            new_sent[-1] = new_sent[-1][:-1] + chr(ord(korean_analyzer.remove_batchim(new_sent[-1][-1])) + batchim_add)

        if pos[1] == 'ECD' or pos[1] == 'ECS':
            if pos[0][0] == '아':
                if korean_analyzer.is_ah(new_sent[-2][-1]):
                    new_sent[-1] = new_sent[-1][1:]
                elif korean_analyzer.is_eu(new_sent[-2][-1]):
                    new_sent[-2] = new_sent[-2][:-1]
            elif pos[0] == '어서' or pos[0] == '어':
                if new_sent[-2][-1] == '하':
                    new_sent[-2] = new_sent[-2][:-1] + '해'
                    new_sent[-1] = new_sent[-1][1:]
                elif new_sent[-2][-1] == '되':
                    new_sent[-2] = new_sent[-2][:-1] + '돼'
                    new_sent[-1] = new_sent[-1][1:]
                    
    last_idx = detect_last_verb(sentence)
    
    if last_idx == None:
            return "No verb found"

    if not korean_analyzer.has_batchim(new_sent[last_idx][-1]): #받침이 없으면 ㄹ 받침을 넣는다.
        new_sent[last_idx] = new_sent[last_idx][:-1] + chr(ord(new_sent[last_idx][-1]) + 8)
    elif (ord(new_sent[last_idx][-1]) - 0xAC00) % 588 % 28!= 8: #받침이 있으면 ~을 을 추가한다. (ㄹ 받침 제외)
        new_sent[last_idx] = new_sent[last_idx] + '을'
    if new_sent[last_idx+1] == '다':
        new_sent[last_idx+1] = ' 것이다'
    if new_sent[last_idx+1] == '어요' or new_sent[last_idx+1] == '아요' or new_sent[last_idx+1] == '에요':
        new_sent[last_idx+1] = ' 거예요'
        
    final_sent = list(''.join(new_sent))
    
    for idx in find_spaces(sentence):
        final_sent.insert(idx, " ")
    
    return ''.join(final_sent)

def make_future_guess(sentence):
    s_list = analyze_kkma(sentence)
    new_sent = []
    for pos in s_list:
        if pos[1] == 'EPT':
            continue
        new_sent.append(pos[0])
        if new_sent[-1] == 'ㅂ니다' or new_sent[-1] == '습니다':
            new_sent[-1] = ' 것 같습니다'
        if new_sent[-1] == 'ㄹ까요' or new_sent[-1] == '일까요':
            new_sent[-1] = ' 것 같나요'
        if new_sent[-1] == '나요':
            new_sent[-1] = ' 것 같나요'
        if new_sent[-1] == 'ㅂ니까':
            new_sent[-1] = ' 것 같습니까'
        '''
        if new_sent[-1][0] == 'ㅂ':
            new_sent[-1] = '습' + new_sent[-1][1:]
        if new_sent[-1][0] == 'ㄹ':
            new_sent[-1] = '을' + new_sent[-1][1:]
        '''
        if pos[1] == 'EFN': #평서형 종결 어미에 자음만 분리 되었을 경우
            for consonant in consonants:
                cons_pos = new_sent[-1].find(consonant)
                if cons_pos != -1:
                    update_sent = list(new_sent[-1])
                    update_sent.pop(cons_pos)
                    update_sent = ''.join(update_sent)
                    new_sent[-1] = update_sent
            
        if pos[1] == 'ETD' and pos[0] in jongsung: #~ㄴ, ~ㄹ 결합
            new_sent.pop()
            batchim_add = jongsung.index(pos[0])+1
            new_sent[-1] = new_sent[-1][:-1] + chr(ord(korean_analyzer.remove_batchim(new_sent[-1][-1])) + batchim_add)

        if pos[1] == 'ECD' or pos[1] == 'ECS':
            if pos[0][0] == '아':
                if korean_analyzer.is_ah(new_sent[-2][-1]):
                    new_sent[-1] = new_sent[-1][1:]
                elif korean_analyzer.is_eu(new_sent[-2][-1]):
                    new_sent[-2] = new_sent[-2][:-1]
            elif pos[0] == '어서' or pos[0] == '어':
                if new_sent[-2][-1] == '하':
                    new_sent[-2] = new_sent[-2][:-1] + '해'
                    new_sent[-1] = new_sent[-1][1:]
                elif new_sent[-2][-1] == '되':
                    new_sent[-2] = new_sent[-2][:-1] + '돼'
                    new_sent[-1] = new_sent[-1][1:]

    last_idx = detect_last_verb(sentence)
    
    if last_idx == None:
            return "No verb found"

    if not korean_analyzer.has_batchim(new_sent[last_idx][-1]): #받침이 없으면 ㄹ 받침을 넣는다.
        new_sent[last_idx] = new_sent[last_idx][:-1] + chr(ord(new_sent[last_idx][-1]) + 8)
    elif (ord(new_sent[last_idx][-1]) - 0xAC00) % 588 % 28!= 8: #받침이 있으면 ~을 을 추가한다. (ㄹ 받침 제외)
        new_sent[last_idx] = new_sent[last_idx] + '을'
    if new_sent[last_idx+1] == '다':
        new_sent[last_idx+1] = ' 것 같다'
    if new_sent[last_idx+1] == '어요' or new_sent[last_idx+1] == '아요' or new_sent[last_idx+1] == '에요':
        new_sent[last_idx+1] = ' 것 같아요'
        
    final_sent = list(''.join(new_sent))
    
    for idx in find_spaces(sentence):
        final_sent.insert(idx, " ")
    
    return ''.join(final_sent)
type
def run_convo():
    file_name = input("enter file name: ")
    if file_name == "exit":
        return 0
    f = open(static(file_name))
    choice = 'p'
    for line in f:
        change = True
        line_s = line.strip()
        tags = line_s[1:line_s.find('>')]
        line_s = line_s[line_s.find('>')+1:]
        if line_s[0] == '#':
            continue
        if line_s[0] == '{':
            print(line_s[1:-1])
            choice = input("Choose tense (p/f): ")
            continue
        if line_s[0] == '[':
            print(line_s[1:-1])
            print()
            continue
        # print(line_s[1:])
        if change:
            if 'g' in tags: #추측 미래 시제
                future = make_future_guess(line_s)
            else: #의지 미래 시제
                future = make_future_will(line_s)
            if choice == 'p':
                print(make_past(line_s))
            elif choice == 'f':
                print(future)
        print()
    f.close()
    return 1


####################################################


def compare_kkma_komoran():
    f = open("./test_sentences.txt", "r")
    for line in f:
        line_s = line.strip()
        print(analyze_kkma(line_s))
        print(analyze_komoran(line_s))
        print()
    f.close()

def compare_kkma_okt():
    f = open("./test_sentences.txt", "r")
    for line in f:
        line_s = line.strip()
        print(analyze_kkma(line_s))
        print(okt.pos(line_s))
        print()
    f.close()

def analyze_komoran(sent):
    return komoran.pos(sent)

def analyze_mecab(sent):
    return mecab.pos(sent)

def analyze_kkma(sent):
    return kkma.pos(sent)

