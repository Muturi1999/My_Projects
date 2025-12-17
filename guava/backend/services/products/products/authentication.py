"""
Custom authentication backend that bypasses login for admin in development.
"""
from django.contrib.auth import get_user_model
from django.contrib.auth.backends import ModelBackend

User = get_user_model()


class NoAuthBackend(ModelBackend):
    """
    Authentication backend that automatically authenticates admin users
    without requiring credentials.
    """
    def authenticate(self, request, username=None, password=None, **kwargs):
        # Auto-authenticate admin user
        if username == 'admin' or username is None:
            try:
                user = User.objects.get(username='admin')
                return user
            except User.DoesNotExist:
                # Create admin user if it doesn't exist
                user = User.objects.create_superuser('admin', 'admin@guava.com', 'admin123')
                return user
        return None

