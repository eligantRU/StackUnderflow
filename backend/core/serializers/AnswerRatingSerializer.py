from rest_framework.serializers import ModelSerializer
from ..models import AnswerRating


class AnswerRatingSerializer(ModelSerializer):
    class Meta:
        model = AnswerRating
        fields = ["origin", "target", "type"]
