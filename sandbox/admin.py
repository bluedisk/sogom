# -*- coding: utf-8 -*-
from django.contrib import admin
from sandbox.models import Study


@admin.register(Study)
class StudyAdmin(admin.ModelAdmin):
    pass
