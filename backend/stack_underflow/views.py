from django.contrib.auth.decorators import login_required
from django.utils.decorators import method_decorator
from rest_framework.response import Response
from rest_framework.views import APIView
from rest_framework.status import HTTP_201_CREATED, HTTP_400_BAD_REQUEST
from django.core.paginator import Paginator

from .models import User, Question, Comment
from .serializers import UserSerializer, QuestionSerializer, CommentSerializer


class UserRegistrationApiView(APIView):
    permission_classes = []

    def post(self, request):
        serializer = UserSerializer(data=request.data)
        if not serializer.is_valid():
            return Response(serializer.errors, status=HTTP_400_BAD_REQUEST)

        serializer.save()
        return Response(serializer.data, status=HTTP_201_CREATED)


class QuestionApiView(APIView):
    permission_classes = []

    def get(self, request, question_id):
        questions = Question.objects.all().filter(id=question_id).values("title", "description", "owner_id", "owner_id__username")
        return Response(questions)

    @method_decorator(login_required)
    def post(self, request, question_id=None):
        data = request.data.copy()
        data["owner_id"] = User.objects.all().filter(username=request.user.username).values_list("id")[0][0]

        serializer = QuestionSerializer(data=data)
        if not serializer.is_valid():
            return Response(serializer.errors, status=HTTP_400_BAD_REQUEST)
        serializer.save()
        return Response(serializer.data, status=HTTP_201_CREATED)


class QuestionPaginatorApiView(APIView):
    permission_classes = []

    QUESTIONS_PER_PAGE = 5

    def get(self, request, page=None):
        questions = Question.objects.all().values("id", "title").order_by("-date")
        paginator = Paginator(questions, self.QUESTIONS_PER_PAGE)

        if page is None:
            return Response({
                "count": paginator.num_pages,
            })
        page = paginator.page(page)
        return Response(page.object_list)


class CommentApiView(APIView):
    permission_classes = []

    def get(self, request, question_id):
        comments = Comment.objects.all().filter(question_id=question_id).values("owner_id__username", "text").order_by("date")
        return Response(comments)

    @method_decorator(login_required)
    def post(self, request, question_id):
        data = request.data.copy()
        data["owner_id"] = User.objects.all().filter(username=request.user.username).values_list("id")[0][0]
        data["question_id"] = question_id

        serializer = CommentSerializer(data=data)
        if not serializer.is_valid():
            return Response(serializer.errors, status=HTTP_400_BAD_REQUEST)
        serializer.save()
        return Response(serializer.data, status=HTTP_201_CREATED)
