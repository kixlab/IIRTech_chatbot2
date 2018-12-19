from django.conf.urls import url

from . import views

urlpatterns = [
    url('initializeBot', views.initializeBot, name='initializeBot'),
    url('fetchMessage', views.fetchMessage, name="fetchMessage"),
    url('fetchTopic', views.fetchTopic, name='fetchTopic'),
    url('fetchActivity', views.fetchActivity, name='fetchActivity'),
    url('chooseTense', views.chooseTense, name="chooseTense"),
    url('translateToEnglish', views.translateToEnglish, name="translateToEnglish"),
    url('handleLog', views.handleLog, name="handleLog"),
    url('closeBot', views.closeBot, name="closeBot"),
]