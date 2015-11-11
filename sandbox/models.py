# -*- coding: utf-8 -*-
from django.db import models
from django.contrib.auth.models import User


class Study(models.Model):
    user = models.OneToOneField(User)
    level = models.IntegerField(u'진행상황', default=0)

