def has_batchim(character): #받침이 있는지 체크
    return int((ord(character) - 0xAC00) % 28) != 0

def remove_batchim(character): #받침 제거
    return chr(((ord(character) - 0xAC00) // 28) * 28 + 0xAC00)

def add_ss(character): #ㅆ 받침 추가
    if remove_batchim(character) == '하': #하 -> 했
        return chr(((ord(character) - 0xAC00) // 28) * 28 + 0xAC30)
    else:
        return chr(((ord(character) - 0xAC00) // 28) * 28 + 0xAC14)

def is_ah(character): #모음이 ㅏ, ㅐ 일 경우
    idx = (ord(character)-0xAC00) % 588
    if idx == 0 or idx == 28:
        return True
    else:
        return False

def is_ahoh(character): #모음이 ㅏ, ㅗ 를 포함할 경우
    idx = (ord(character)-0xAC00) % 588
    if (idx >= 0 and idx < 28) or (idx >= 224 and idx < 252):
        return True
    else:
        return False

def is_oh(character): #모음이 ㅗ 일 경우
    idx = (ord(character)-0xAC00) % 588
    if idx == 224:
        return True
    else:
        return False

def is_yi(character): #모음이 ㅣ 일 경우
    idx = (ord(character)-0xAC00) % 588
    if idx == 560:
        return True
    else:
        return False

def is_eu(character): #모음이 ㅡ 일 경우
    idx = (ord(character)-0xAC00) % 588
    if idx == 504:
        return True
    else:
        return False

def is_oo(character): #모음이 ㅜ 일 경우
    idx = (ord(character)-0xAC00) % 588
    if idx == 364:
        return True
    else:
        return False