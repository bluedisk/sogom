# -*- coding: utf-8 -*-
from django.shortcuts import render, redirect
from django.contrib import auth
from django.contrib.auth.forms import AuthenticationForm
from django.core.urlresolvers import reverse


def home(request):
    return render(request, 'home/home.html')


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

    return render(request, 'home/login.html', {'form': form})


def logout(request):
    auth.logout(request)
    return redirect(reverse('home'))
