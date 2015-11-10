from django.shortcuts import render

def sandbox(request):
    return render(request, 'sandbox/sandbox.html')
