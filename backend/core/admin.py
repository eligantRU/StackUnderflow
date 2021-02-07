from django.contrib import admin

from .models import Question, Comment, User
from .models.rating_system import Rating


admin.site.register(Question)
admin.site.register(Comment)
admin.site.register(User)
admin.site.register(Rating)
