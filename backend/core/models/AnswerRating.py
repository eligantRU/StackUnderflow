from django.db.models import Model, ForeignKey, CASCADE, IntegerField, IntegerChoices

from core.models.User import User
from core.models.Answer import Answer


class RatingType(IntegerChoices):
    LIKE = 1, "LIKE"
    DISLIKE = -1, "DISLIKE"


class AnswerRating(Model):
    origin = ForeignKey(User, on_delete=CASCADE)
    target = ForeignKey(Answer, on_delete=CASCADE)
    type = IntegerField(choices=RatingType.choices, null=True)

    class Meta:
        unique_together = ("origin", "target")
