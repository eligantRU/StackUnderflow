from rest_framework.serializers import ModelSerializer
from ..models import Question


class QuestionSerializer(ModelSerializer):
    class Meta:
        model = Question
        fields = ["id", "owner", "title", "description", "resolved_answer"]
