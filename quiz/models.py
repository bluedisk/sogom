# -*- coding: utf-8 -*-
from ckeditor.fields import RichTextField
from django.db import models
from django.contrib.auth.models import User


class Study(models.Model):
    user = models.OneToOneField(User)
    level = models.ForeignKey("Level")


class Level(models.Model):

    class Meta:
        ordering = ('level',)

    level = models.PositiveSmallIntegerField(u'level')
    name = models.CharField(u'레벨명', max_length=20)

    width = models.IntegerField(u'width')
    height = models.IntegerField(u'height')

    desc = RichTextField(u'레벨 설명')

    SOLUTION_TYPE_CHOICES = (
        ('func', '배열 리턴 함수'),
        ('gen', '위치 재너레이터')
    )

    solution_type = models.CharField(u'해답 함수 타입', choices=SOLUTION_TYPE_CHOICES)
    solution_func = models.TextField(u'해답 합수 or 생성자')
    solution_checker = models.TextField(u'해답 선 검증 함수')

    pre_code = models.TextField(u'소스 앞부분')
    placeholder = models.TextField(u'기본 코드')
    post_code = models.TextField(u'소스 뒷부분')


class LevelHint(models.Model):
    class Meta:
        ordering = ('step',)

    level = models.ForeignKey(Level)
    step = models.PositiveSmallIntegerField(u'단계')
    hint_level = models.IntegerField(u'힌트 레벨')

    hint = RichTextField(u'힌트')


class Sketch(models.Model):
    user = models.ForeignKey(User)
    level = models.ForeignKey(Level)

    code = models.TextField(u'코드')

    updated_at = models.DateTimeField(u'갱신일자', auto_now=True)