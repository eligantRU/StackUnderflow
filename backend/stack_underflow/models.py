from django.contrib.auth.models import AbstractUser
from django.db.models import Model, ForeignKey, SET_NULL, CharField, TextField


class User(AbstractUser):
    pass


class Question(Model):
    owner_id = ForeignKey(User, on_delete=SET_NULL, null=True)
    title = CharField(max_length=100)
    description = TextField(blank=True)
