"""
Views for account commands (write operations).
"""
import sys
from pathlib import Path

BASE_DIR = Path(__file__).resolve().parent.parent.parent.parent.parent
sys.path.insert(0, str(BASE_DIR / 'backend' / 'shared'))

from rest_framework import status, viewsets
from rest_framework.decorators import action
from rest_framework.response import Response
from rest_framework.permissions import AllowAny, IsAuthenticated
from rest_framework.authtoken.models import Token
from django.utils import timezone
from .models import User, Admin, Address, VerificationCode, PasswordResetToken
from .serializers import (
    UserRegistrationSerializer, UserLoginSerializer, AdminLoginSerializer,
    SocialLoginSerializer, PasswordResetRequestSerializer, PasswordResetVerifySerializer,
    PasswordResetSerializer, VerificationCodeSerializer, ResendVerificationCodeSerializer,
    UserUpdateSerializer, PasswordChangeSerializer, AddressSerializer, AdminSerializer
)
from .services import (
    VerificationService, PasswordResetService, UserService, SessionService
)


class UserRegistrationViewSet(viewsets.ViewSet):
    """ViewSet for user registration"""
    permission_classes = [AllowAny]
    
    @action(detail=False, methods=['post'], url_path='register')
    def register(self, request):
        """Register a new user"""
        serializer = UserRegistrationSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        
        user = serializer.save()
        
        # Create verification code if email or phone provided
        verification_service = VerificationService()
        if user.email:
            verification_service.create_verification_code(
                user, 'email_verification', user.email
            )
        elif user.phone:
            verification_service.create_verification_code(
                user, 'phone_verification', user.phone
            )
        
        # Generate token for immediate login
        token, created = Token.objects.get_or_create(user=user)
        
        return Response({
            'message': 'User registered successfully. Please verify your email/phone.',
            'user_id': str(user.id),
            'token': token.key,
            'verification_required': True,
            'verification_method': user.verification_method
        }, status=status.HTTP_201_CREATED)


class UserLoginViewSet(viewsets.ViewSet):
    """ViewSet for user login"""
    permission_classes = [AllowAny]
    
    @action(detail=False, methods=['post'], url_path='login')
    def login(self, request):
        """User login"""
        serializer = UserLoginSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        
        user = serializer.validated_data['user']
        
        # Update last login
        UserService.update_last_login(user)
        
        # Create session
        session_key = request.session.session_key or request.session.create()
        SessionService.create_session(
            user=user,
            session_key=session_key,
            device_info=request.data.get('device_info'),
            ip_address=self._get_client_ip(request),
            user_agent=request.META.get('HTTP_USER_AGENT', '')
        )
        
        # Generate or get token
        token, created = Token.objects.get_or_create(user=user)
        
        return Response({
            'message': 'Login successful',
            'token': token.key,
            'user_id': str(user.id),
            'email': user.email,
            'phone': user.phone,
            'name': user.get_full_name(),
            'email_verified': user.email_verified,
            'phone_verified': user.phone_verified,
        }, status=status.HTTP_200_OK)
    
    @action(detail=False, methods=['post'], url_path='logout')
    def logout(self, request):
        """User logout"""
        if request.user.is_authenticated:
            # Delete token
            Token.objects.filter(user=request.user).delete()
            
            # Deactivate session
            if request.session.session_key:
                SessionService.deactivate_session(request.session.session_key)
        
        return Response({'message': 'Logout successful'}, status=status.HTTP_200_OK)
    
    def _get_client_ip(self, request):
        """Get client IP address"""
        x_forwarded_for = request.META.get('HTTP_X_FORWARDED_FOR')
        if x_forwarded_for:
            ip = x_forwarded_for.split(',')[0]
        else:
            ip = request.META.get('REMOTE_ADDR')
        return ip


class AdminLoginViewSet(viewsets.ViewSet):
    """ViewSet for admin login"""
    permission_classes = [AllowAny]
    
    @action(detail=False, methods=['post'], url_path='login')
    def login(self, request):
        """Admin login"""
        serializer = AdminLoginSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        
        user = serializer.validated_data['user']
        
        # Update last login
        UserService.update_last_login(user)
        
        # Create session
        session_key = request.session.session_key or request.session.create()
        SessionService.create_session(
            user=user,
            session_key=session_key,
            device_info=request.data.get('device_info'),
            ip_address=self._get_client_ip(request),
            user_agent=request.META.get('HTTP_USER_AGENT', '')
        )
        
        # Generate or get token
        token, created = Token.objects.get_or_create(user=user)
        
        # Get admin profile if exists
        admin_profile = None
        try:
            admin = Admin.objects.get(user=user)
            admin_profile = {
                'id': str(admin.id),
                'role': admin.role,
                'department': admin.department,
            }
        except Admin.DoesNotExist:
            pass
        
        return Response({
            'message': 'Admin login successful',
            'token': token.key,
            'user_id': str(user.id),
            'email': user.email,
            'phone': user.phone,
            'name': user.get_full_name(),
            'admin_profile': admin_profile,
        }, status=status.HTTP_200_OK)
    
    def _get_client_ip(self, request):
        """Get client IP address"""
        x_forwarded_for = request.META.get('HTTP_X_FORWARDED_FOR')
        if x_forwarded_for:
            ip = x_forwarded_for.split(',')[0]
        else:
            ip = request.META.get('REMOTE_ADDR')
        return ip


class SocialLoginViewSet(viewsets.ViewSet):
    """ViewSet for social login"""
    permission_classes = [AllowAny]
    
    @action(detail=False, methods=['post'], url_path='login')
    def login(self, request):
        """Social login (Google, Apple, Facebook)"""
        serializer = SocialLoginSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        
        provider = serializer.validated_data['provider']
        provider_id = serializer.validated_data['provider_id']
        email = serializer.validated_data.get('email')
        name = serializer.validated_data.get('name')
        first_name = serializer.validated_data.get('first_name')
        last_name = serializer.validated_data.get('last_name')
        
        user, is_new = UserService.create_or_get_social_user(
            provider=provider,
            provider_id=provider_id,
            email=email,
            name=name,
            first_name=first_name,
            last_name=last_name
        )
        
        # Update last login
        UserService.update_last_login(user)
        
        # Create session
        session_key = request.session.session_key or request.session.create()
        SessionService.create_session(
            user=user,
            session_key=session_key,
            device_info=request.data.get('device_info'),
            ip_address=self._get_client_ip(request),
            user_agent=request.META.get('HTTP_USER_AGENT', '')
        )
        
        # Generate or get token
        token, created = Token.objects.get_or_create(user=user)
        
        return Response({
            'message': 'Social login successful',
            'is_new_user': is_new,
            'token': token.key,
            'user_id': str(user.id),
            'email': user.email,
            'phone': user.phone,
            'name': user.get_full_name(),
            'email_verified': user.email_verified,
            'phone_verified': user.phone_verified,
        }, status=status.HTTP_200_OK)
    
    def _get_client_ip(self, request):
        """Get client IP address"""
        x_forwarded_for = request.META.get('HTTP_X_FORWARDED_FOR')
        if x_forwarded_for:
            ip = x_forwarded_for.split(',')[0]
        else:
            ip = request.META.get('REMOTE_ADDR')
        return ip


class VerificationViewSet(viewsets.ViewSet):
    """ViewSet for email/phone verification"""
    permission_classes = [AllowAny]
    
    @action(detail=False, methods=['post'], url_path='verify')
    def verify(self, request):
        """Verify email or phone"""
        serializer = VerificationCodeSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        
        email_or_phone = serializer.validated_data['email_or_phone']
        code = serializer.validated_data['code']
        verification_type = serializer.validated_data['verification_type']
        
        # Find user
        try:
            if '@' in email_or_phone:
                user = User.objects.get(email=email_or_phone)
            else:
                user = User.objects.get(phone=email_or_phone)
        except User.DoesNotExist:
            return Response(
                {'error': 'User not found'},
                status=status.HTTP_404_NOT_FOUND
            )
        
        # Verify code
        verification_service = VerificationService()
        is_valid, verification_code = verification_service.verify_code(
            user, code, verification_type
        )
        
        if not is_valid:
            return Response(
                {'error': 'Invalid or expired verification code'},
                status=status.HTTP_400_BAD_REQUEST
            )
        
        # Mark as verified
        if verification_type == 'email_verification':
            UserService.verify_email(user)
        elif verification_type == 'phone_verification':
            UserService.verify_phone(user)
        
        return Response({
            'message': 'Verification successful',
            'email_verified': user.email_verified,
            'phone_verified': user.phone_verified,
        }, status=status.HTTP_200_OK)
    
    @action(detail=False, methods=['post'], url_path='resend')
    def resend(self, request):
        """Resend verification code"""
        serializer = ResendVerificationCodeSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        
        email_or_phone = serializer.validated_data['email_or_phone']
        verification_type = serializer.validated_data['verification_type']
        
        # Find user
        try:
            if '@' in email_or_phone:
                user = User.objects.get(email=email_or_phone)
            else:
                user = User.objects.get(phone=email_or_phone)
        except User.DoesNotExist:
            return Response(
                {'error': 'User not found'},
                status=status.HTTP_404_NOT_FOUND
            )
        
        # Create new verification code
        verification_service = VerificationService()
        verification_code = verification_service.create_verification_code(
            user, verification_type, email_or_phone
        )
        
        return Response({
            'message': 'Verification code sent successfully',
            'code': verification_code.code,  # In production, send via email/SMS, don't return code
        }, status=status.HTTP_200_OK)


class PasswordResetViewSet(viewsets.ViewSet):
    """ViewSet for password reset"""
    permission_classes = [AllowAny]
    
    @action(detail=False, methods=['post'], url_path='request')
    def request_reset(self, request):
        """Request password reset"""
        serializer = PasswordResetRequestSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        
        email_or_phone = serializer.validated_data['email_or_phone']
        method = serializer.validated_data['method']
        
        # Find user
        try:
            if '@' in email_or_phone:
                user = User.objects.get(email=email_or_phone)
            else:
                user = User.objects.get(phone=email_or_phone)
        except User.DoesNotExist:
            # Don't reveal if user exists or not (security best practice)
            return Response({
                'message': 'If the account exists, a verification code has been sent.'
            }, status=status.HTTP_200_OK)
        
        # Create verification code
        verification_service = VerificationService()
        verification_code = verification_service.create_verification_code(
            user, 'password_reset', email_or_phone
        )
        
        return Response({
            'message': 'If the account exists, a verification code has been sent.',
            'code': verification_code.code,  # In production, send via email/SMS
        }, status=status.HTTP_200_OK)
    
    @action(detail=False, methods=['post'], url_path='verify')
    def verify_code(self, request):
        """Verify password reset code and get token"""
        serializer = PasswordResetVerifySerializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        
        email_or_phone = serializer.validated_data['email_or_phone']
        code = serializer.validated_data['code']
        
        # Find user
        try:
            if '@' in email_or_phone:
                user = User.objects.get(email=email_or_phone)
            else:
                user = User.objects.get(phone=email_or_phone)
        except User.DoesNotExist:
            return Response(
                {'error': 'User not found'},
                status=status.HTTP_404_NOT_FOUND
            )
        
        # Verify code
        verification_service = VerificationService()
        is_valid, verification_code = verification_service.verify_code(
            user, code, 'password_reset'
        )
        
        if not is_valid:
            return Response(
                {'error': 'Invalid or expired verification code'},
                status=status.HTTP_400_BAD_REQUEST
            )
        
        # Create reset token
        reset_service = PasswordResetService()
        reset_token = reset_service.create_reset_token(user)
        
        return Response({
            'message': 'Code verified successfully',
            'token': reset_token.token,
        }, status=status.HTTP_200_OK)
    
    @action(detail=False, methods=['post'], url_path='reset')
    def reset(self, request):
        """Reset password using token"""
        serializer = PasswordResetSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        
        token = serializer.validated_data['token']
        new_password = serializer.validated_data['new_password']
        
        # Verify token
        reset_service = PasswordResetService()
        is_valid, reset_token = reset_service.verify_token(token)
        
        if not is_valid:
            return Response(
                {'error': 'Invalid or expired reset token'},
                status=status.HTTP_400_BAD_REQUEST
            )
        
        # Reset password
        user = reset_token.user
        user.set_password(new_password)
        user.save()
        
        # Mark token as used
        reset_service.use_token(reset_token)
        
        # Invalidate all user sessions
        SessionService.deactivate_all_user_sessions(user)
        
        return Response({
            'message': 'Password reset successful'
        }, status=status.HTTP_200_OK)


class UserProfileViewSet(viewsets.ViewSet):
    """ViewSet for user profile management"""
    permission_classes = [IsAuthenticated]
    
    @action(detail=False, methods=['get', 'put', 'patch'], url_path='profile')
    def profile(self, request):
        """Get or update user profile"""
        if request.method == 'GET':
            from queries.serializers import UserProfileSerializer
            serializer = UserProfileSerializer(request.user)
            return Response(serializer.data, status=status.HTTP_200_OK)
        
        elif request.method in ['PUT', 'PATCH']:
            serializer = UserUpdateSerializer(
                request.user,
                data=request.data,
                partial=request.method == 'PATCH'
            )
            serializer.is_valid(raise_exception=True)
            serializer.save()
            
            from queries.serializers import UserProfileSerializer
            response_serializer = UserProfileSerializer(request.user)
            return Response(response_serializer.data, status=status.HTTP_200_OK)
    
    @action(detail=False, methods=['post'], url_path='change-password')
    def change_password(self, request):
        """Change user password"""
        serializer = PasswordChangeSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        
        old_password = serializer.validated_data['old_password']
        new_password = serializer.validated_data['new_password']
        
        # Verify old password
        if not request.user.check_password(old_password):
            return Response(
                {'error': 'Current password is incorrect'},
                status=status.HTTP_400_BAD_REQUEST
            )
        
        # Set new password
        request.user.set_password(new_password)
        request.user.save()
        
        # Invalidate all sessions except current
        if request.session.session_key:
            SessionService.deactivate_all_user_sessions(request.user)
            # Create new session
            request.session.create()
        
        return Response({
            'message': 'Password changed successfully'
        }, status=status.HTTP_200_OK)


class AddressViewSet(viewsets.ModelViewSet):
    """ViewSet for user addresses"""
    permission_classes = [IsAuthenticated]
    serializer_class = AddressSerializer
    
    def get_queryset(self):
        return Address.objects.filter(user=self.request.user, is_active=True)
    
    def perform_create(self, serializer):
        serializer.save(user=self.request.user)
    
    def perform_destroy(self, instance):
        instance.soft_delete()


class AdminViewSet(viewsets.ModelViewSet):
    """ViewSet for admin management"""
    permission_classes = [IsAuthenticated]
    serializer_class = AdminSerializer
    queryset = Admin.objects.filter(is_active=True)
    
    def get_queryset(self):
        # Only superusers can manage admins
        if not self.request.user.is_superuser:
            return Admin.objects.none()
        return Admin.objects.filter(is_active=True)

