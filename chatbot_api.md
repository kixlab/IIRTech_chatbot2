# README for Chatbot API
## Base Url
- /iirtech
## 주제 선택
> 사용자가 대화를 나눌 주제를 선택한다.

### Request
| method |  resource  |     
| :----: | :--------: |
|  get   | /fetchTopic |

- Success Response(Status 200)
  ```
  {
      "topics": ["3급_일상생활","3급_건강","4급_쇼핑","5급_학교생활"],
  }
  ```
  - 반환 값 설명
    - topics: 사용자가 선택할 수 있는 주제 목록. (반환되는 주제 갯수의 초기값은 5로 설정되어 있음)
---
## 어휘 문제 가져오기
> 사용자가 대화를 나누기에 앞서 학습해야 할 어휘에 대한 액티비티를 가져온다.

### Request
| method |  resource  |     
| :----: | :--------: |
|  get   | /fetchActivity |

- parameter
    - topic: 유저가 선택한 주제
        - 현재 주제 리스트:
            - 3급 일상생활
            - 3급 건강
            - 4급 쇼핑
            - 5급 학교생활
            - 이외 backend/static/scenario 디렉토리 참조

- Success Response(Status 200)
  ```
  {
        "response": [{
                'type': 'v',
                'lang': 'kor',
                'content': '공원',
                'options': ['park', 'theatre', 'bedroom'],
                'correct': 0,
            }]
  }
  ```
  - 반환 값 설명
    - response: JSON 형식의 어휘 문제 리스트
      - type: 'v' (어휘) / 'g' (문법) - 현재 모든 문제는 어휘 문제로 구현됨
      - lang: 'kor' / 'eng' - 사용자에게 주어지는 타겟 어휘가 한글 또는 영어인지 구분
      - content: 타겟 어휘
      - options: 타겟 어휘의 정확한 번역 및 그 외의 객관식 distractor 두 단어를 포함한 리스트
      - correct: options 리스트에서 정답의 인덱스
---
## 챗봇 초기화
> 처음 챗봇을 시작할 때 초기값을 지정해준다.

### Request
| method |  resource  |     
| :----: | :--------: |
|  get   | /initializeBot |

- parameter
    - topic: 유저가 선택한 주제
        - 현재 주제 리스트:
            - 영화관
            - 여행
            - 건강
            - 3급 일상생활
            - 3급 건강
            - 3급 교통
            - 3급 여행
            - 4급 쇼핑
            - 5급 학교생활

- Success Response(Status 200)
  ```
  {
      "text": ["안녕하세요", "반가워요"],
      "success": 1,
      "userid": "blahblah",
      "hasTense": False,
  }
  ```
  - 반환 값 설명
    - text: 챗봇의 다음 발화 리스트
    - success: 성공 여부
    - userid: 유저 아이디
    - hasTense: 시제 변환 가능 여부
<!-- 
- Error Response(Status 401)
  ```
  {
  	"type": "warning" | "error",
  	"contents": "error messages"
  }
  ``` 
 -->
---
## 메세지 가져오기
> 챗봇의 다음 발화 문장을 가져온다.

### Request
| method |     resource      |
| :----: | :---------------: |
|  get   | /fetchMessage     |

- parameter
  - text: 유저 발화 내용
  - type: 발화 종류 (현재는 1만 구현)
    - 1: 일반 발화
    - 2: 질문 발화
  - userid: 유저 아이디

### Response
- Success(Status 200)
  ```
    {
        "text": ["오늘은 건강에 대해 배울 거예요."],
        "type": 0,
        "success": 1,
        "userid": "blahblah",
        "nextline": "네 알겠습니다."
        "original": ""
        "errorcount": 0
        "corrected": ""
    }
  ```  
  - 반환 값 설명
    - text: 챗봇의 다음 발화 리스트
    - type: 메세지 타입
        - 0: 기본 메시지
        - 1: 종료 메시지
    - success: 성공 여부
    - userid: 유저 아이디
    - nextline: 다음 유저 예상 발화
    - original: 이전 유저 발화
    - errorcount: 이전 유저 발화 맞춤법 오류 개수
    - corrected: 맞춤법 수정 결과
<!--     
- Error
  ```
  {
  	"type": "warning" | "danger",
  	"contents": "error messages"
  }
  ```
 -->
---
## 시제 설정
> 챗봇 발화 시제를 설정한다.

### Request
| method |        resource         |
| :----: | :---------------------: |
|  get   | /chooseTense            |

- parameter:
    - tense: 시제
        - p: 과거 시제
        - f: 미래 시제
    - userid: 유저 아이디

### Response
- Success(Status 200)
  ```
  {
      "tense": 'p',
      "guidemsg": '영화관에 간 경험에 대해 얘기해봅시다.,나중에 영화관에 가는 경험을 생각해 얘기해봅시다.'
  }
  ```
  - 반환 값 설명
    - tense: 선택된 시제 반환
    - guidemsg: 과거, 미래 시제에 대한 가이드 메세지 (쉼표로 나뉘어짐)
<!-- 
- Error
  ```
  {
  	"type": "warning" | "danger",
  	"contents": "error messages"
  }
  ```
 -->
---
## 한국어 > 영어 번역
> 한국어 문장을 Papago를 사용해 영어로 번역한다.

### Request
| method |          resource           |
| :----: | :-------------------------: |
|  get   | /translateToEnglish         |

- parameter:
    - text: 번역할 한글 문장

### Response
- Success(Status 200)
  ```
  {
      translatedText: "Have you been to a movie theater recently?"
  }
  ```
  - 반환 값 설명
    - translatedText: 변환된 영어 문장
<!-- 
- Error
  ```
  {
  	"type": "warning" | "danger",
  	"contents": "error messages"
  }
  ```
 -->
---
## 로그 관리
> 로그 파일에 내용을 기록한다.

### Request
| method |           resource           |
| :----: | :--------------------------: |
|  get   | /handleLog                   |

- parameter:
    - userid: 유저 아이디
    - type: 로그 타입
        - 0: 챗봇 발화
        - 1: 유저 발화
        - 2: 시스템 메시지
        - 3: 선택 메시지
    - content: 로그 내용

### Response
- Success(Status 200)
  ```
  {
      "success": True
  }
  ```
  - 반환 값 설명:
    - success: 로그 성공 여부
<!-- 
- Error
  ```
  {
  	"type": "warning" | "danger",
  	"contents": "error messages"
  }
  ```
 -->
---
## 챗봇 종료
> 챗봇 사용이 끝나고 챗봇을 종료한다.

### Request
| method |             resource              |
| :----: | :-------------------------------: |
|  get   | /closeBot |

- parameter
  - userid: 유저 아이디

### Response
- Success(Status 200)
  ```
  {
      "success": True
  }
  ```
  - 반환 값 설명: 
    - success: 봇 종료 성공 여부
<!-- 
- Error
  ```
  {
  	"type": "warning" | "danger",
  	"contents": "error messages"
  }
  ```
 -->