"""
Business logic services for account commands.
"""
import sys
from pathlib import Path

BASE_DIR = Path(__file__).resolve().parent.parent.parent.parent.parent
sys.path.insert(0, str(BASE_DIR / 'backend' / 'shared'))

from django.utils import timezone
from datetime import timedelta
import secrets
import string
from .models import User, VerificationCode, PasswordResetToken, UserSession


class VerificationService:
    """Service for handling verification codes"""
    
    @staticmethod
    def generate_code(length=6):
        """Generate a random verification code"""
        return ''.join(secrets.choice(string.digits) for _ in range(length))
    
    @staticmethod
    def create_verification_code(user, verification_type, target):
        """Create a verification code"""
        # Invalidate existing codes of the same type
        VerificationCode.objects.filter(
            user=user,
            verification_type=verification_type,
            is_used=False
        ).update(is_used=True)
        
        code = VerificationService.generate_code()
        expires_at = timezone.now() + timedelta(minutes=15)  # 15 minutes expiry
        
        verification_code = VerificationCode.objects.create(
            user=user,
            code=code,
            verification_type=verification_type,
            target=target,
            expires_at=expires_at
        )
        
        return verification_code
    
    @staticmethod
    def verify_code(user, code, verification_type):
        """Verify a code"""
        try:
            verification_code = VerificationCode.objects.get(
                user=user,
                code=code,
                verification_type=verification_type,
                is_used=False,
                expires_at__gt=timezone.now()
            )
            
            verification_code.is_used = True
            verification_code.save()
            
            return True, verification_code
        except VerificationCode.DoesNotExist:
            return False, None


class PasswordResetService:
    """Service for handling password reset"""
    
    @staticmethod
    def generate_token():
        """Generate a secure password reset token"""
        return secrets.token_urlsafe(32)
    
    @staticmethod
    def create_reset_token(user):
        """Create a password reset token"""
        # Invalidate existing tokens
        PasswordResetToken.objects.filter(
            user=user,
            is_used=False
        ).update(is_used=True)
        
        token = PasswordResetService.generate_token()
        expires_at = timezone.now() + timedelta(hours=1)  # 1 hour expiry
        
        reset_token = PasswordResetToken.objects.create(
            user=user,
            token=token,
            expires_at=expires_at
        )
        
        return reset_token
    
    @staticmethod
    def verify_token(token):
        """Verify a password reset token"""
        try:
            reset_token = PasswordResetToken.objects.get(
                token=token,
                is_used=False,
                expires_at__gt=timezone.now()
            )
            return True, reset_token
        except PasswordResetToken.DoesNotExist:
            return False, None
    
    @staticmethod
    def use_token(reset_token):
        """Mark a token as used"""
        reset_token.is_used = True
        reset_token.save()


class UserService:
    """Service for user operations"""
    
    @staticmethod
    def verify_email(user):
        """Mark user's email as verified"""
        user.email_verified = True
        user.save(update_fields=['email_verified'])
        return user
    
    @staticmethod
    def verify_phone(user):
        """Mark user's phone as verified"""
        user.phone_verified = True
        user.save(update_fields=['phone_verified'])
        return user
    
    @staticmethod
    def update_last_login(user):
        """Update user's last login timestamp"""
        user.last_login = timezone.now()
        user.save(update_fields=['last_login'])
        return user
    
    @staticmethod
    def create_or_get_social_user(provider, provider_id, email=None, name=None, first_name=None, last_name=None):
        """Create or get user from social login"""
        # Map provider to field name
        provider_field_map = {
            'google': 'google_id',
            'apple': 'apple_id',
            'facebook': 'facebook_id'
        }
        
        provider_field = provider_field_map.get(provider)
        if not provider_field:
            raise ValueError(f"Unknown provider: {provider}")
        
        # Try to find existing user by provider ID
        try:
            user = User.objects.get(**{provider_field: provider_id})
            return user, False  # Existing user
        except User.DoesNotExist:
            pass
        
        # Try to find existing user by email
        if email:
            try:
                user = User.objects.get(email=email)
                # Link the provider ID
                setattr(user, provider_field, provider_id)
                user.save()
                return user, False  # Existing user, linked provider
            except User.DoesNotExist:
                pass
        
        # Create new user
        user_data = {
            provider_field: provider_id,
            'email': email,
            'name': name,
            'first_name': first_name,
            'last_name': last_name,
            'email_verified': bool(email),  # Assume verified if from social provider
        }
        
        # Remove None values
        user_data = {k: v for k, v in user_data.items() if v is not None}
        
        user = User.objects.create_user(**user_data)
        return user, True  # New user


class SessionService:
    """Service for managing user sessions"""
    
    @staticmethod
    def create_session(user, session_key, device_info=None, ip_address=None, user_agent=None):
        """Create a new user session"""
        # Deactivate old sessions if needed (optional: limit concurrent sessions)
        # UserSession.objects.filter(user=user, is_active=True).update(is_active=False)
        
        session = UserSession.objects.create(
            user=user,
            session_key=session_key,
            device_info=device_info or {},
            ip_address=ip_address,
            user_agent=user_agent,
        )
        
        return session
    
    @staticmethod
    def deactivate_session(session_key):
        """Deactivate a session"""
        UserSession.objects.filter(session_key=session_key).update(is_active=False)
    
    @staticmethod
    def deactivate_all_user_sessions(user):
        """Deactivate all sessions for a user"""
        UserSession.objects.filter(user=user, is_active=True).update(is_active=False)

