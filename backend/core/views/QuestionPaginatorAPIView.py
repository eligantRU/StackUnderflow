from rest_framework.response import Response
from rest_framework.views import APIView
from django.core.paginator import Paginator

from ..models import Question


class QuestionPaginatorAPIView(APIView):
    permission_classes = []

    def get(self, request, page=None):
        questions_per_page = int(request.query_params.get("questions_per_page"))

        questions = Question.objects.all().values("id", "title").order_by("-date")
        paginator = Paginator(questions, questions_per_page)

        if page is None:
            return Response({
                "count": paginator.num_pages,
            })
        page = paginator.page(page)
        return Response(page.object_list)
