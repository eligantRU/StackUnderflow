from django.contrib import admin

from .models import User, Question, Answer, AnswerRating


admin.site.register(User)
admin.site.register(Question)
admin.site.register(Answer)
admin.site.register(AnswerRating)
