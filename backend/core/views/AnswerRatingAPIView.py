from django.contrib.auth.decorators import login_required
from django.utils.decorators import method_decorator
from rest_framework.response import Response
from rest_framework.views import APIView
from django.db.transaction import atomic

from ..models import Answer, AnswerRating, RatingType


class AnswerRatingAPIView(APIView):
    permission_classes = []

    @method_decorator(login_required)
    def put(self, request, *args, **kwargs):
        data = request.data

        origin = request.user
        answer_id = data.get("answer_id")
        action = data.get("action")
        action_type = self.get_action_type(action)
        target = Answer.objects.all().get(id=answer_id)

        with atomic():
            is_exists = AnswerRating.objects.all().filter(origin=origin, target=target).exists()
            if is_exists:
                rating = AnswerRating.objects.all().get(origin=origin, target=target)
                if rating.type == action_type:
                    rating.delete()
                    return Response()

        AnswerRating.objects.all().update_or_create(
            origin=origin, target=target,
            defaults={
                "type": action_type,
            }
        )
        return Response()

    @staticmethod
    def get_action_type(action):
        return next(value for label, value in zip(RatingType.labels, RatingType.values) if label == action)
