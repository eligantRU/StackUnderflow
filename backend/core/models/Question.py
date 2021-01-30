from django.db.models import Model, ForeignKey, SET_NULL, CharField, TextField, DateTimeField
from django.utils.timezone import now

from .User import User


class Question(Model):
    owner_id = ForeignKey(User, on_delete=SET_NULL, null=True)
    title = CharField(max_length=100)
    description = TextField(blank=True)
    date = DateTimeField(editable=False, default=now)
    resolved_answer_id = ForeignKey("core.Comment", on_delete=SET_NULL, null=True)
