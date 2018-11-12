from django.conf.urls import url

from . import views

urlpatterns = [
    url('fetchMessage', views.fetchMessage, name="fetchMessage"),
    url('fetchActivity', views.fetchActivity, name='fetchActivity'),
    url('chooseTense', views.chooseTense, name="chooseTense"),
    url('translateToKorean', views.translateToKorean, name="translateToKorean"),
    url('handleLog', views.handleLog, name="handleLog"),
    url('closeBot', views.closeBot, name="closeBot"),
]