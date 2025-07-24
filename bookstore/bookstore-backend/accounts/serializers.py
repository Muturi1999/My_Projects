from rest_framework import serializers
from .models import CustomUser, NewsletterSubscriber
from django.contrib.auth.password_validation import validate_password

class RegisterSerializer(serializers.ModelSerializer):
    password = serializers.CharField(write_only=True, validators=[validate_password])

    class Meta:
        model = CustomUser
        fields = ['username', 'email', 'phone', 'national_id', 'password']

    def create(self, validated_data):
        return CustomUser.objects.create_user(**validated_data)

class NewsletterSubscriberSerializer(serializers.ModelSerializer):
    class Meta:
        model = NewsletterSubscriber
        fields = ['id', 'email', 'subscribed_at']