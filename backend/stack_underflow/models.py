from django.contrib.auth.models import AbstractUser
from django.db.models import Model, ForeignKey, SET_NULL, CASCADE, CharField, TextField, DateTimeField
from django.utils.timezone import now


class User(AbstractUser):
    pass


class Question(Model):
    owner_id = ForeignKey(User, on_delete=SET_NULL, null=True)
    title = CharField(max_length=100)
    description = TextField(blank=True)


class Comment(Model):
    owner_id = ForeignKey(User, on_delete=SET_NULL, null=True)
    question_id = ForeignKey(Question, on_delete=CASCADE, null=True)
    text = TextField(blank=False)
    date = DateTimeField(editable=False, default=now)
