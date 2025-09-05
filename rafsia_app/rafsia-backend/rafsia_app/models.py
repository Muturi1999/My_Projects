from django.db import models

class Respondent(models.Model):
    name = models.CharField(max_length=100, blank=True)  # Anonymous option
    role = models.CharField(max_length=50)
    institution = models.CharField(max_length=100)
    email = models.EmailField(blank=True)
    mobile = models.CharField(max_length=20, blank=True)
    location = models.CharField(max_length=100)
    lat = models.FloatField(null=True, blank=True)
    lng = models.FloatField(null=True, blank=True)
    consent = models.BooleanField(default=False)
    type = models.CharField(max_length=3, choices=[('IHL', 'IHL'), ('ISP', 'ISP')], default='IHL')
    created_at = models.DateTimeField(auto_now_add=True)

class SurveyResponse(models.Model):
    respondent = models.ForeignKey(Respondent, on_delete=models.CASCADE)
    dimension = models.CharField(max_length=50)
    question = models.TextField()
    score = models.IntegerField()

class InterviewResponse(models.Model):
    respondent = models.ForeignKey(Respondent, on_delete=models.CASCADE)
    question = models.TextField()
    answer = models.TextField()
    dimension = models.CharField(max_length=50)

class ReadinessScore(models.Model):
    respondent = models.ForeignKey(Respondent, on_delete=models.CASCADE)
    technical = models.FloatField()
    economic = models.FloatField()
    policy = models.FloatField()
    socio_cultural = models.FloatField()
    environmental = models.FloatField()
    overall = models.FloatField()
    level = models.CharField(max_length=20)
    recommendations = models.TextField()