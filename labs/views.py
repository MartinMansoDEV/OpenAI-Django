from django.shortcuts import render
from django.conf import settings
from django.http import HttpResponse
import json
import openai

# Create your views here.
def show_chat(response):
    """Show the main chat"""
    return render(response, "chat.html", {})

def operate_msg(request):
    """Send a request to OpenAI with a custom message"""

    msg =  request.GET.get('msg','');
    
    openai.api_key = settings.OPENAI_KEY
    if settings.OPENAI_KEY != "":
        response = openai.Completion.create(
        engine="davinci",
        prompt=msg,
        temperature=0.3,
        max_tokens=60,
        top_p=1.0,
        frequency_penalty=0.0,
        presence_penalty=0.0,
        stop=["\n"]
        )
    else:
        response = {'error': 'OpenAI key not configured'}
    return HttpResponse(json.dumps(response), content_type="application/json")
