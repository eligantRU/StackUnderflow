from django.contrib.auth.decorators import login_required
from django.contrib.auth import update_session_auth_hash
from django.utils.decorators import method_decorator
from rest_framework.response import Response
from rest_framework.views import APIView
from rest_framework.status import HTTP_201_CREATED, HTTP_400_BAD_REQUEST

from ..models import User
from ..serializers import UserSerializer


class UserAPIView(APIView):
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
        if data.get("password", None):
            update_session_auth_hash(request, user)
        return Response(serializer.data)
