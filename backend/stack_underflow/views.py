from django.contrib.auth.decorators import login_required
from django.contrib.auth import update_session_auth_hash
from django.contrib import messages  # TODO:
from django.utils.decorators import method_decorator
from rest_framework.response import Response
from rest_framework.views import APIView
from rest_framework.status import HTTP_200_OK, HTTP_201_CREATED, HTTP_400_BAD_REQUEST
from django.core.paginator import Paginator

from .models import User, Question, Comment
from .serializers import UserSerializer, QuestionSerializer, CommentSerializer


class UserApiView(APIView):
    permission_classes = []

    @method_decorator(login_required)
    def get(self, request):
        user = User.objects.all().filter(username=request.user.username).values("email")[0]
        return Response(user)

    def post(self, request):
        serializer = UserSerializer(data=request.data)
        if not serializer.is_valid():
            return Response(serializer.errors, status=HTTP_400_BAD_REQUEST)

        serializer.save()
        return Response(serializer.data, status=HTTP_201_CREATED)

    @method_decorator(login_required)
    def put(self, request, *args, **kwargs):
        data = request.data.copy()
        if data.get("new_password", ""):
            if data.get("old_password", ""):
                if request.user.check_password(data["old_password"]):
                    data["password"] = data["new_password"]
                else:
                    return Response({
                        "old_password": ["Invalid password"],
                    }, status=HTTP_400_BAD_REQUEST)
            else:
                return Response({
                    "old_password": ["Password (old) field cannot be empty"],
                }, status=HTTP_400_BAD_REQUEST)

        serializer = UserSerializer(request.user, data=data, partial=True)
        if not serializer.is_valid():
            return Response(serializer.errors, status=HTTP_400_BAD_REQUEST)
        user = serializer.save()
        if data.get("password", ""):
            update_session_auth_hash(request, user)
        return Response(serializer.data, status=HTTP_200_OK)


class QuestionApiView(APIView):
    permission_classes = []

    def get(self, request, question_id):
        question = Question.objects.all().filter(id=question_id).values("title", "description", "owner_id", "owner_id__username")[0]
        return Response(question)

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
