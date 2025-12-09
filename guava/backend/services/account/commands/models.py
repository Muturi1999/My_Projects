"""
Account models for commands (write side of CQRS).
"""
import sys
from pathlib import Path

# Add shared to path
BASE_DIR = Path(__file__).resolve().parent.parent.parent.parent.parent
sys.path.insert(0, str(BASE_DIR / 'backend' / 'shared'))

from django.db import models
from django.contrib.auth.models import AbstractBaseUser, BaseUserManager, PermissionsMixin
from django.core.validators import RegexValidator
from shared.common.models import BaseModel
import uuid


class UserManager(BaseUserManager):
    """Manager for custom user model"""
    
    def create_user(self, email=None, phone=None, password=None, **extra_fields):
        """Create and save a regular user"""
        if not email and not phone:
            raise ValueError('Either email or phone must be provided')
        
        user = self.model(email=email, phone=phone, **extra_fields)
        user.set_password(password)
        user.save(using=self._db)
        return user
    
    def create_superuser(self, email=None, phone=None, password=None, **extra_fields):
        """Create and save a superuser"""
        extra_fields.setdefault('is_staff', True)
        extra_fields.setdefault('is_superuser', True)
        extra_fields.setdefault('is_admin', True)
        
        if extra_fields.get('is_staff') is not True:
            raise ValueError('Superuser must have is_staff=True.')
        if extra_fields.get('is_superuser') is not True:
            raise ValueError('Superuser must have is_superuser=True.')
        
        return self.create_user(email=email, phone=phone, password=password, **extra_fields)


class User(BaseModel, AbstractBaseUser, PermissionsMixin):
    """
    Custom User model supporting email or phone authentication.
    """
    email = models.EmailField(unique=True, null=True, blank=True, db_index=True)
    phone = models.CharField(
        max_length=20,
        unique=True,
        null=True,
        blank=True,
        db_index=True,
        validators=[RegexValidator(
            regex=r'^\+?1?\d{9,15}$',
            message="Phone number must be entered in the format: '+999999999'. Up to 15 digits allowed."
        )]
    )
    name = models.CharField(max_length=255, blank=True)
    first_name = models.CharField(max_length=100, blank=True)
    last_name = models.CharField(max_length=100, blank=True)
    
    # Authentication fields
    is_active = models.BooleanField(default=True, db_index=True)
    is_staff = models.BooleanField(default=False)
    is_superuser = models.BooleanField(default=False)
    is_admin = models.BooleanField(default=False)  # Admin user flag
    
    # Verification fields
    email_verified = models.BooleanField(default=False, db_index=True)
    phone_verified = models.BooleanField(default=False, db_index=True)
    verification_method = models.CharField(
        max_length=10,
        choices=[('email', 'Email'), ('phone', 'Phone')],
        null=True,
        blank=True
    )
    
    # Profile fields
    date_of_birth = models.DateField(null=True, blank=True)
    gender = models.CharField(
        max_length=10,
        choices=[('male', 'Male'), ('female', 'Female'), ('other', 'Other')],
        blank=True
    )
    profile_picture = models.URLField(max_length=500, blank=True)
    
    # Social login fields
    google_id = models.CharField(max_length=255, unique=True, null=True, blank=True, db_index=True)
    apple_id = models.CharField(max_length=255, unique=True, null=True, blank=True, db_index=True)
    facebook_id = models.CharField(max_length=255, unique=True, null=True, blank=True, db_index=True)
    
    # Timestamps
    last_login = models.DateTimeField(null=True, blank=True)
    date_joined = models.DateTimeField(auto_now_add=True)
    
    USERNAME_FIELD = 'email'
    REQUIRED_FIELDS = []
    
    objects = UserManager()
    
    class Meta:
        db_table = 'users'
        ordering = ['-date_joined']
        indexes = [
            models.Index(fields=['email', 'is_active']),
            models.Index(fields=['phone', 'is_active']),
            models.Index(fields=['email_verified', 'phone_verified']),
        ]
    
    def __str__(self):
        return self.email or self.phone or str(self.id)
    
    def get_full_name(self):
        """Return the full name of the user"""
        if self.first_name and self.last_name:
            return f"{self.first_name} {self.last_name}"
        return self.name or self.email or self.phone
    
    def get_short_name(self):
        """Return the short name of the user"""
        return self.first_name or self.name or self.email or self.phone


class Admin(BaseModel):
    """
    Admin user model (separate from regular users).
    """
    user = models.OneToOneField(
        User,
        on_delete=models.CASCADE,
        related_name='admin_profile'
    )
    role = models.CharField(
        max_length=50,
        choices=[
            ('super_admin', 'Super Admin'),
            ('admin', 'Admin'),
            ('manager', 'Manager'),
            ('support', 'Support'),
        ],
        default='admin'
    )
    permissions = models.JSONField(default=dict, blank=True)  # Custom permissions
    department = models.CharField(max_length=100, blank=True)
    
    class Meta:
        db_table = 'admins'
        ordering = ['-created_at']
    
    def __str__(self):
        return f"Admin: {self.user.get_full_name()}"


class Address(BaseModel):
    """
    User address model.
    """
    user = models.ForeignKey(
        User,
        on_delete=models.CASCADE,
        related_name='addresses'
    )
    label = models.CharField(max_length=50, default='Home')  # Home, Work, Other
    first_name = models.CharField(max_length=100)
    last_name = models.CharField(max_length=100)
    phone = models.CharField(max_length=20)
    address_line_1 = models.CharField(max_length=255)
    address_line_2 = models.CharField(max_length=255, blank=True)
    city = models.CharField(max_length=100)
    state = models.CharField(max_length=100, blank=True)
    postal_code = models.CharField(max_length=20, blank=True)
    country = models.CharField(max_length=100, default='Kenya')
    is_default = models.BooleanField(default=False, db_index=True)
    
    class Meta:
        db_table = 'addresses'
        ordering = ['-is_default', '-created_at']
        indexes = [
            models.Index(fields=['user', 'is_default']),
        ]
    
    def __str__(self):
        return f"{self.label} - {self.address_line_1}, {self.city}"


class VerificationCode(BaseModel):
    """
    Verification code for email/phone verification and password reset.
    """
    user = models.ForeignKey(
        User,
        on_delete=models.CASCADE,
        related_name='verification_codes'
    )
    code = models.CharField(max_length=6, db_index=True)
    verification_type = models.CharField(
        max_length=20,
        choices=[
            ('email_verification', 'Email Verification'),
            ('phone_verification', 'Phone Verification'),
            ('password_reset', 'Password Reset'),
        ],
        db_index=True
    )
    target = models.CharField(max_length=255)  # Email or phone number
    is_used = models.BooleanField(default=False, db_index=True)
    expires_at = models.DateTimeField(db_index=True)
    
    class Meta:
        db_table = 'verification_codes'
        ordering = ['-created_at']
        indexes = [
            models.Index(fields=['code', 'is_used', 'expires_at']),
            models.Index(fields=['user', 'verification_type', 'is_used']),
        ]
    
    def __str__(self):
        return f"{self.verification_type} code for {self.target}"


class PasswordResetToken(BaseModel):
    """
    Password reset token model.
    """
    user = models.ForeignKey(
        User,
        on_delete=models.CASCADE,
        related_name='password_reset_tokens'
    )
    token = models.CharField(max_length=255, unique=True, db_index=True)
    is_used = models.BooleanField(default=False, db_index=True)
    expires_at = models.DateTimeField(db_index=True)
    
    class Meta:
        db_table = 'password_reset_tokens'
        ordering = ['-created_at']
        indexes = [
            models.Index(fields=['token', 'is_used', 'expires_at']),
        ]
    
    def __str__(self):
        return f"Reset token for {self.user}"


class UserSession(BaseModel):
    """
    User session tracking model.
    """
    user = models.ForeignKey(
        User,
        on_delete=models.CASCADE,
        related_name='sessions'
    )
    session_key = models.CharField(max_length=255, unique=True, db_index=True)
    device_info = models.JSONField(default=dict, blank=True)
    ip_address = models.GenericIPAddressField(null=True, blank=True)
    user_agent = models.TextField(blank=True)
    is_active = models.BooleanField(default=True, db_index=True)
    last_activity = models.DateTimeField(auto_now=True)
    
    class Meta:
        db_table = 'user_sessions'
        ordering = ['-last_activity']
        indexes = [
            models.Index(fields=['user', 'is_active']),
        ]
    
    def __str__(self):
        return f"Session for {self.user}"

