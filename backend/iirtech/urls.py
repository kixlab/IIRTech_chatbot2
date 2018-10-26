from django.conf.urls import url

from . import views

urlpatterns = [
    url('fetchMessage', views.fetchMessage, name="fetchMessage"),
    url('fetchActivity', views.fetchActivity, name='fetchActivity')
]