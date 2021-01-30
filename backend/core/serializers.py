from django.contrib.auth.hashers import make_password
from rest_framework.serializers import ModelSerializer
from .models import User, Question, Comment


class UserSerializer(ModelSerializer):
    def create(self, validated_data):
        return User.objects.create(
            username=validated_data["username"],
            email=validated_data["email"],
            password=make_password(validated_data["password"]),
        )

    def update(self, instance, validated_data):
        if "password" in validated_data:
            instance.password = make_password(validated_data["password"])
            del validated_data["password"]

        instance.save()
        return super().update(instance, validated_data)

    class Meta:
        model = User
        fields = ["id", "username", "password", "email"]


class QuestionSerializer(ModelSerializer):
    class Meta:
        model = Question
        fields = ["id", "owner_id", "title", "description", "resolved_answer_id"]


class CommentSerializer(ModelSerializer):
    class Meta:
        model = Comment
        fields = ["id", "owner_id", "question_id", "text"]
