import requests
s = requests.Session()
url = 'http://rndcenter.iirtech.co.kr:40000'
payload = { 'id': 'kixlab', 'password': 'kixlab' }
s.post(url+'/api/login', data=payload)
rd = s.get('http://rndcenter.iirtech.co.kr:40000/api/instructions-count')
count = rd.json()['count']
rd = s.get('http://rndcenter.iirtech.co.kr:40000/api/instructions?offset=0&limit=%s' %count)
lst = rd.json()
for elm in lst:
	filepath = elm['url']
	level = str(elm['level']).strip()
	main = elm['main_category_name'].strip()
	sub = elm['sub_category_name'].strip()
	filename = main + "-" + sub
	filename = filename.replace('/',',')
	id = elm['id']
	meta = s.get('http://rndcenter.iirtech.co.kr:40000/api/instructions/%d' %(id)).json()
	main_id = meta['meta']['main_category_id']
	sub_id = meta['meta']['sub_category_id']
	link = '/api/instructions/vocabularies?level=%s&mainCategoryId=%d&subCategoryId=%d' %(level, main_id, sub_id)
	vocab = s.get(url+link).json()
	print(filename,vocab)
	break
