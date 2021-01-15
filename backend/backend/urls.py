from django.urls import path
from stack_underflow import views  # TODO:
from django.contrib import admin
from rest_framework_simplejwt.views import TokenObtainPairView, TokenRefreshView


urlpatterns = [
    path('admin/', admin.site.urls),
    path('api/token/', TokenObtainPairView.as_view()),
    path('api/token/refresh/', TokenRefreshView.as_view()),
    path('api/users/register/', views.UserRegistrationApiView.as_view()),
    path('api/questions/', views.QuestionApiView.as_view()),
    path('api/questions/<int:question_id>/', views.QuestionApiView.as_view()),
    path('api/questions/page/<int:page>', views.QuestionPaginatorApiView.as_view()),
    path('api/questions/page/', views.QuestionPaginatorApiView.as_view()),
    path('api/comments/question/<int:question_id>', views.CommentApiView.as_view()),
]
