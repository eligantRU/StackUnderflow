from django.contrib.auth.decorators import login_required
from django.contrib.auth import update_session_auth_hash
from django.contrib import messages  # TODO:
from django.utils.decorators import method_decorator
from rest_framework.response import Response
from rest_framework.views import APIView
from rest_framework.status import HTTP_201_CREATED, HTTP_400_BAD_REQUEST, HTTP_405_METHOD_NOT_ALLOWED
from django.core.paginator import Paginator
from django.db.transaction import atomic
from django.db import connection

from .models import User, Question, Comment, Rating, LikeType
from .serializers import UserSerializer, QuestionSerializer, CommentSerializer

# TODO: multiple files


class UserApiView(APIView):
    permission_classes = []

    @method_decorator(login_required)
    def get(self, request):
        user = User.objects.all().values("id", "username", "email").get(username=request.user.username)
        return Response(user)

    def post(self, request):
        serializer = UserSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)
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
        serializer.is_valid(raise_exception=True)
        user = serializer.save()
        if data.get("password", ""):
            update_session_auth_hash(request, user)
        return Response(serializer.data)


class QuestionApiView(APIView):
    permission_classes = []

    def get(self, request, question_id):
        question = Question.objects.all().values("title", "description", "resolved_answer_id", "owner_id", "owner_id__username").get(id=question_id)
        return Response(question)

    @method_decorator(login_required)
    def post(self, request, question_id=None):
        data = request.data.copy()
        data["owner_id"] = User.objects.all().values("id").get(username=request.user.username)["id"]

        serializer = QuestionSerializer(data=data)
        serializer.is_valid(raise_exception=True)
        serializer.save()
        return Response(serializer.data, status=HTTP_201_CREATED)

    @method_decorator(login_required)
    def put(self, request, *args, **kwargs):
        question_id = kwargs["question_id"]
        data = request.data.copy()

        question = Question.objects.all().get(id=question_id)
        if question.owner_id != request.user:
            return Response(status=HTTP_405_METHOD_NOT_ALLOWED)

        resolved_answer_id = data.get("resolved_answer_id", None)
        if resolved_answer_id:
            if question.resolved_answer_id:
                return Response(status=HTTP_405_METHOD_NOT_ALLOWED)
            resolved_answer = Comment.objects.all().get(id=resolved_answer_id)
            question.resolved_answer_id = resolved_answer

        question.save()
        return Response()


class QuestionPaginatorApiView(APIView):
    permission_classes = []

    QUESTIONS_PER_PAGE = 5  # TODO: to frontend

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
        with connection.cursor() as cursor:
            cursor.execute("""
                SELECT cc.id as id, cc.text, cu.username, COALESCE(SUM(cr.type), 0) AS rating, cr2.type AS my_rate
                FROM core_comment cc
                LEFT JOIN core_user cu ON cu.id = cc.owner_id_id
                LEFT JOIN core_rating cr ON cr.target_id = cc.id
                LEFT JOIN core_rating cr2 ON cr2.target_id = cc.id AND cr2.origin_id = %s
                WHERE cc.question_id_id = %s
                GROUP BY cc.id, cu.username, cr2.type
                ORDER BY cc.date
            """, [request.user.id, question_id])
            columns = [col[0] for col in cursor.description]
            comments = [dict(zip(columns, row)) for row in cursor.fetchall()]
        return Response(comments)

    @method_decorator(login_required)
    def post(self, request, question_id):
        data = request.data.copy()
        data["owner_id"] = User.objects.all().values("id").get(username=request.user.username)["id"]
        data["question_id"] = question_id

        serializer = CommentSerializer(data=data)
        serializer.is_valid(raise_exception=True)
        serializer.save()
        return Response(serializer.data, status=HTTP_201_CREATED)


class CommentRatingApiView(APIView):
    permission_classes = []

    @method_decorator(login_required)
    def put(self, request, *args, **kwargs):
        data = request.data

        origin = request.user
        answer_id = data.get("answer_id")
        action = data.get("action")
        type = self.get_action_type(action)
        target = Comment.objects.all().get(id=answer_id)

        with atomic():
            is_exists = Rating.objects.all().filter(origin=origin, target=target).exists()
            if is_exists:
                rating = Rating.objects.all().get(origin=origin, target=target)
                if rating.type == type:
                    rating.delete()
                    return Response()

        Rating.objects.all().update_or_create(
            origin=origin, target=target,
            defaults={
                "type": type,
            }
        )
        return Response()

    @staticmethod
    def get_action_type(action):
        return next(value for label, value in zip(LikeType.labels, LikeType.values) if label == action)
