# -*- coding: utf-8 -*-
from django.contrib.auth.decorators import login_required
from django.shortcuts import render


@login_required
def sandbox(request):
    return render(request, 'sandbox/sandbox.html')


