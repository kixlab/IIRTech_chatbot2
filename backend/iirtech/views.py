from django.shortcuts import render
from django.http import HttpResponse
import json

# Create your views here.
def fetchMessage(request):
    msg = request.GET['text']
    if msg:
        print(msg)
        js = {'success': 'success', 'msg': msg}
        return HttpResponse(json.dumps(js), content_type="application/json")
