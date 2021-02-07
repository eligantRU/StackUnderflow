from django.db.models import Model, ForeignKey, SET_NULL, CASCADE, TextField, DateTimeField
from django.utils.timezone import now

from .User import User
from .Question import Question


class Answer(Model):
    owner = ForeignKey(User, on_delete=SET_NULL, null=True)
    question = ForeignKey(Question, on_delete=CASCADE, null=True)
    text = TextField(blank=False)
    date = DateTimeField(editable=False, default=now)
