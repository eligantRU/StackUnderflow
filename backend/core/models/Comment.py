from django.db.models import Model, ForeignKey, SET_NULL, CASCADE, TextField, DateTimeField
from django.utils.timezone import now

from .User import User
from .Question import Question


class Comment(Model):  # TODO: Comment -> Answer
    owner_id = ForeignKey(User, on_delete=SET_NULL, null=True)
    question_id = ForeignKey(Question, on_delete=CASCADE, null=True)
    text = TextField(blank=False)
    date = DateTimeField(editable=False, default=now)
