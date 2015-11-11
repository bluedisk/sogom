# -*- coding: utf-8 -*-
from django.shortcuts import render, redirect
from django.contrib import auth
from django.contrib.auth.forms import AuthenticationForm
from django.core.urlresolvers import reverse


def greeting(request):
    return render(request, 'greeting/greeting.html')


def login(request):

    if request.method == 'POST':
        form = AuthenticationForm(request.POST)

        if form.is_valid():
            user = auth.authenticate(form)
            if user:
                auth.login(request, user)
                return redirect(request.POST['next'])

    else:
        form = AuthenticationForm()

    return render(request, 'greeting/login.html', {'form': form})


def logout(request):
    auth.logout(request)
    return redirect(reverse('greeting'))
