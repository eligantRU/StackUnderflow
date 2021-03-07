from django.urls import path
from rest_framework_simplejwt.views import TokenObtainPairView, TokenRefreshView

from core.views import UserAPIView, QuestionAPIView, AnswerAPIView, QuestionPaginatorAPIView, AnswerRatingAPIView


urlpatterns = [
	path('api/token/', TokenObtainPairView.as_view()),
	path('api/token/refresh/', TokenRefreshView.as_view()),
	path('api/users/', UserAPIView.as_view()),
	path('api/questions/', QuestionAPIView.as_view()),
	path('api/questions/<int:question_id>/', QuestionAPIView.as_view()),
	path('api/questions/page/<int:page>', QuestionPaginatorAPIView.as_view()),
	path('api/questions/page/', QuestionPaginatorAPIView.as_view()),
	path('api/comments/question/<int:question_id>', AnswerAPIView.as_view()),
	path('api/answers/rating', AnswerRatingAPIView.as_view()),
]
