from django.contrib.auth.decorators import login_required
from django.utils.decorators import method_decorator
from rest_framework.response import Response
from rest_framework.views import APIView
from rest_framework.status import HTTP_201_CREATED
from django.db import connection

from ..models import User
from ..serializers import AnswerSerializer


class AnswerAPIView(APIView):
    permission_classes = []

    def get(self, request, question_id):
        with connection.cursor() as cursor:
            cursor.execute("""
                SELECT ca.id as id, ca.text, cu.username, COALESCE(SUM(car.type), 0) AS rating, car2.type AS my_rate
                FROM core_answer ca
                LEFT JOIN core_user cu ON cu.id = ca.owner_id
                LEFT JOIN core_answerrating car ON car.target_id = ca.id
                LEFT JOIN core_answerrating car2 ON car2.target_id = ca.id AND car2.origin_id = %s
                WHERE ca.question_id = %s
                GROUP BY ca.id, cu.username, car2.type
                ORDER BY ca.date
            """, [request.user.id, question_id])
            columns = [col[0] for col in cursor.description]
            answers = [dict(zip(columns, row)) for row in cursor.fetchall()]
        return Response(answers)

    @method_decorator(login_required)
    def post(self, request, question_id):
        data = request.data.copy()
        data["owner"] = User.objects.all().values("id").get(username=request.user.username)["id"]
        data["question"] = question_id

        serializer = AnswerSerializer(data=data)
        serializer.is_valid(raise_exception=True)
        serializer.save()
        return Response(serializer.data, status=HTTP_201_CREATED)
