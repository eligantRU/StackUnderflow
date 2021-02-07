from django.db.models import Model, ForeignKey, CASCADE, IntegerField, IntegerChoices


from ..User import User
from ..Comment import Comment


class LikeType(IntegerChoices):
    LIKE = 1, "LIKE"
    DISLIKE = -1, "DISLIKE"


class Rating(Model):  # TODO: Rating -> AnswerRating (+ filename)
    origin = ForeignKey(User, on_delete=CASCADE)
    target = ForeignKey(Comment, on_delete=CASCADE)
    type = IntegerField(choices=LikeType.choices, null=True)

    class Meta:
        unique_together = ("origin", "target")
