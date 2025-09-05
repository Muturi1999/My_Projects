from rest_framework import viewsets, status
from rest_framework.response import Response
from rest_framework.decorators import action, permission_classes
from rest_framework.permissions import IsAuthenticated
from django.db.models import Avg
from .models import Respondent, SurveyResponse, ReadinessScore, InterviewResponse
from .serializers import RespondentSerializer, SurveyResponseSerializer, ReadinessScoreSerializer, InterviewResponseSerializer

class RespondentViewSet(viewsets.ModelViewSet):
    queryset = Respondent.objects.all()
    serializer_class = RespondentSerializer

    @action(detail=False, methods=['post'])
    def submit_survey(self, request):
        data = request.data
        respondent = Respondent.objects.create(
            name=data.get('name', 'Anonymous'),
            role=data['role'],
            institution=data['institution'],
            email=data.get('email', ''),
            mobile=data.get('mobile', ''),
            location=data['location'],
            lat=data.get('lat', 0.2827),
            lng=data.get('lng', 34.7519),
            consent=True,
            type=data['type']
        )
        for res in data['responses']:
            SurveyResponse.objects.create(respondent=respondent, dimension=res['dimension'], question=res['question'], score=res['score'])

        scores = SurveyResponse.objects.filter(respondent=respondent).values('dimension').annotate(avg_score=Avg('score'))
        dim_scores = {s['dimension']: s['avg_score'] * 20 for s in scores}
        overall = sum(dim_scores.values()) / len(dim_scores) if dim_scores else 0
        level = 'Very Ready' if overall >= 80 else 'Not Sure' if overall >= 60 else 'Not Ready'
        recs = self.generate_recommendations(dim_scores)

        ReadinessScore.objects.create(
            respondent=respondent,
            technical=dim_scores.get('Technical', 0),
            economic=dim_scores.get('Economic', 0),
            policy=dim_scores.get('Policy', 0),
            socio_cultural=dim_scores.get('Socio-Cultural', 0),
            environmental=dim_scores.get('Environmental', 0),
            overall=overall,
            level=level,
            recommendations=recs
        )

        return Response({'status': 'success', 'overall_score': overall, 'level': level, 'dim_scores': dim_scores, 'recommendations': recs}, status=status.HTTP_201_CREATED)

    def generate_recommendations(self, dim_scores):
        recs = []
        if dim_scores.get('Technical', 100) < 60:
            recs.append('Upgrade ICT infrastructure, ensure reliable power supply, and train staff on satellite maintenance.')
        # ... (same for other dimensions as before)
        return '\n'.join(recs)

@permission_classes([IsAuthenticated])
class InterviewViewSet(viewsets.ModelViewSet):
    queryset = InterviewResponse.objects.all()
    serializer_class = InterviewResponseSerializer

@permission_classes([IsAuthenticated])
class DashboardViewSet(viewsets.ViewSet):
    @action(detail=False)
    def get_dashboard(self, request):
        # ... (same as updated in previous, with filters)
        return Response({'scores': list(scores), 'averages': avg_scores})

    @action(detail=False, methods=['get'])
    def export_interviews(self, request):
        interviews = InterviewResponse.objects.all().values('respondent__institution', 'dimension', 'question', 'answer')  # No personal
        return Response(list(interviews))