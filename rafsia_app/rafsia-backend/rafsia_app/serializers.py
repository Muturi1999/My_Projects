from rest_framework import serializers
from .models import Respondent, SurveyResponse, ReadinessScore, InterviewResponse

class RespondentSerializer(serializers.ModelSerializer):
    class Meta:
        model = Respondent
        fields = '__all__'  # But frontend avoids personal fields

class SurveyResponseSerializer(serializers.ModelSerializer):
    class Meta:
        model = SurveyResponse
        fields = '__all__'

class ReadinessScoreSerializer(serializers.ModelSerializer):
    class Meta:
        model = ReadinessScore
        fields = '__all__'

class InterviewResponseSerializer(serializers.ModelSerializer):
    class Meta:
        model = InterviewResponse
        fields = '__all__'