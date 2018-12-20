import requests, os, urllib
from .vocab_extractor import Papago
from iirtech.models import VocabList, Filename

def dialogueInit():
    s = requests.Session()
    url = 'http://rndcenter.iirtech.co.kr:40000'
    payload = { 'id': 'kixlab', 'password': 'kixlab' }
    s.post(url+'/api/login', data=payload)
    rd = s.get(url + '/api/instructions-count')
    count = rd.json()['count']
    rd = s.get(url + '/api/instructions?offset=0&limit=%s' %count)
    lst = rd.json()
    count = 0
    try:
        for elm in lst:
            filepath = elm['url']
            level = str(elm['level']).strip()
            main = elm['main_category_name'].strip()
            sub = elm['sub_category_name'].strip()
            filename = main + "-" + sub
            filename = filename.replace('/',',')
            print(count, filename)
            count+=1
            _id = elm['id']
            meta = s.get('http://rndcenter.iirtech.co.kr:40000/api/instructions/%d' %(_id)).json()
            path = './static/scenario/%s/%s.xlsx' %(level, filename)
            if not os.path.isfile(path):
                xlsx = s.get(url+filepath)
                with open(path, 'wb') as f:
                    f.write(xlsx.content)
                _filename = '%s/%s.xlsx' %(level, filename)
                topic = '%s급_%s' %(_filename[0], _filename[2:])
                f, created = Filename.objects.get_or_create(
                    filename=filename,
                    topic=topic
                )
                main_id = meta['meta']['main_category_id']
                sub_id = meta['meta']['sub_category_id']
                link = '/api/instructions/vocabularies?level=%s&mainCategoryId=%d&subCategoryId=%d' %(level, main_id, sub_id)
                vocab = s.get(url+link).json()
                for e in vocab:
                    v = e['name']
                    translated = Papago('nmt',v,'ko')
                    _vocab, created = VocabList.objects.get_or_create(
                        filename=filename,
                        word=v,
                        translated=translated.strip().lower(),
                        level=''
                    )
    except urllib.error.HTTPError:
        print("HTTP Error: too many request occurred")