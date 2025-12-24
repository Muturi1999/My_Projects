"""
Views for accounts app - authentication endpoints.
"""
from rest_framework import status, generics, permissions, viewsets
from rest_framework.decorators import api_view, permission_classes, action
from rest_framework.response import Response
from rest_framework_simplejwt.tokens import RefreshToken
from django.contrib.auth import authenticate
from django.contrib.auth import get_user_model
from .serializers import (
    UserSerializer,
    UserRegistrationSerializer,
    UserLoginSerializer
)
from .permissions import IsAdmin, IsAdminOrStaff

User = get_user_model()


class RegisterView(generics.CreateAPIView):
    """User registration endpoint."""
    queryset = User.objects.all()
    permission_classes = (permissions.AllowAny,)
    serializer_class = UserRegistrationSerializer
    
    def create(self, request, *args, **kwargs):
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        user = serializer.save()
        
        # Generate JWT tokens
        refresh = RefreshToken.for_user(user)
        
        return Response({
            'user': UserSerializer(user).data,
            'tokens': {
                'refresh': str(refresh),
                'access': str(refresh.access_token),
            }
        }, status=status.HTTP_201_CREATED)


@api_view(['POST'])
@permission_classes([permissions.AllowAny])
def login_view(request):
    """User login endpoint (email/phone + password)."""
    serializer = UserLoginSerializer(data=request.data)
    serializer.is_valid(raise_exception=True)
    
    email_or_phone = serializer.validated_data['email_or_phone']
    password = serializer.validated_data['password']
    
    # Try to find user by email or phone
    try:
        user = User.objects.get(email=email_or_phone)
    except User.DoesNotExist:
        try:
            user = User.objects.get(phone=email_or_phone)
        except User.DoesNotExist:
            return Response(
                {'error': 'Invalid credentials'},
                status=status.HTTP_401_UNAUTHORIZED
            )
    
    # Authenticate user
    user = authenticate(username=user.username, password=password)
    if user is None:
        return Response(
            {'error': 'Invalid credentials'},
            status=status.HTTP_401_UNAUTHORIZED
        )
    
    if not user.is_active:
        return Response(
            {'error': 'User account is disabled'},
            status=status.HTTP_401_UNAUTHORIZED
        )
    
    # Generate JWT tokens
    refresh = RefreshToken.for_user(user)
    
    return Response({
        'user': UserSerializer(user).data,
        'tokens': {
            'refresh': str(refresh),
            'access': str(refresh.access_token),
        }
    })


class UserProfileView(generics.RetrieveUpdateAPIView):
    """Get and update user profile."""
    serializer_class = UserSerializer
    permission_classes = (permissions.IsAuthenticated,)
    
    def get_object(self):
        return self.request.user


class UserViewSet(viewsets.ModelViewSet):
    """ViewSet for User model - Admin/Staff only."""
    queryset = User.objects.all()
    serializer_class = UserSerializer
    permission_classes = [IsAdminOrStaff]
    search_fields = ['email', 'username', 'phone', 'first_name', 'last_name']
    filterset_fields = ['is_customer', 'is_staff', 'is_active']
    ordering = ['-date_joined']
    
    @action(detail=True, methods=['post'])
    def activate(self, request, pk=None):
        """Activate a user account."""
        user = self.get_object()
        user.is_active = True
        user.save()
        return Response({'message': 'User activated successfully'})
    
    @action(detail=True, methods=['post'])
    def deactivate(self, request, pk=None):
        """Deactivate a user account."""
        user = self.get_object()
        user.is_active = False
        user.save()
        return Response({'message': 'User deactivated successfully'})
    
    @action(detail=True, methods=['post'])
    def make_staff(self, request, pk=None):
        """Make a user staff."""
        user = self.get_object()
        user.is_staff = True
        user.save()
        return Response({'message': 'User is now staff'})
    
    @action(detail=False, methods=['get'])
    def staff(self, request):
        """Get all staff users."""
        staff_users = self.get_queryset().filter(is_staff=True)
        serializer = self.get_serializer(staff_users, many=True)
        return Response(serializer.data)
    
    @action(detail=False, methods=['get'])
    def customers(self, request):
        """Get all customer users."""
        customers = self.get_queryset().filter(is_customer=True, is_staff=False)
        serializer = self.get_serializer(customers, many=True)
        return Response(serializer.data)

