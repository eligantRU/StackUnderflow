from django.contrib.auth.decorators import login_required
from django.utils.decorators import method_decorator
from rest_framework.response import Response
from rest_framework.views import APIView
from rest_framework.status import HTTP_201_CREATED, HTTP_405_METHOD_NOT_ALLOWED

from ..models import Question, Answer
from ..serializers import QuestionSerializer


class QuestionAPIView(APIView):
    permission_classes = []

    def get(self, request, question_id):
        question = Question.objects.all().values("title", "description", "resolved_answer", "owner", "owner__username").get(id=question_id)
        return Response(question)

    @method_decorator(login_required)
    def post(self, request, question_id=None):
        data = request.data.copy()
        data["owner"] = request.user.id

        serializer = QuestionSerializer(data=data)
        serializer.is_valid(raise_exception=True)
        serializer.save()
        return Response(serializer.data, status=HTTP_201_CREATED)

    @method_decorator(login_required)
    def put(self, request, *args, **kwargs):
        question_id = kwargs["question_id"]
        data = request.data.copy()

        question = Question.objects.all().get(id=question_id)
        if question.owner != request.user:
            return Response(status=HTTP_405_METHOD_NOT_ALLOWED)

        resolved_answer_id = data.get("resolved_answer_id", None)
        if resolved_answer_id:
            if question.resolved_answer:
                return Response(status=HTTP_405_METHOD_NOT_ALLOWED)
            resolved_answer = Answer.objects.all().get(id=resolved_answer_id)
            question.resolved_answer = resolved_answer

        question.save()
        return Response()
