from django.shortcuts import render


def greeting(request):
    return render(request,'greeting/greeting.html')
