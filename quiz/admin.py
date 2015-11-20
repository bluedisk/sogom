# -*- coding: utf-8 -*-
from adminsortable2.admin import SortableAdminMixin, SortableInlineAdminMixin
from django.contrib import admin
from .models import Study, Level, LevelHint


@admin.register(Study)
class StudyAdmin(admin.ModelAdmin):
    pass


class HintInline(SortableInlineAdminMixin, admin.TabularInline):
    model = LevelHint


@admin.register(Level)
class LevelAdmin(admin.ModelAdmin, SortableAdminMixin):
    inlines = [HintInline, ]


