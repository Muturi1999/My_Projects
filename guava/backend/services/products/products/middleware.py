"""
Middleware to auto-authenticate admin users in development.
"""
from django.contrib.auth import login
from django.contrib.auth import get_user_model
from django.utils.deprecation import MiddlewareMixin

User = get_user_model()


class AutoAdminAuthMiddleware(MiddlewareMixin):
    """
    Automatically authenticate as admin user when accessing admin URLs.
    This bypasses the login requirement for development.
    """
    def process_request(self, request):
        # Only apply to admin URLs
        if request.path.startswith('/admin/'):
            # If user is not authenticated, auto-login as admin
            if not request.user.is_authenticated:
                try:
                    admin_user = User.objects.get(username='admin')
                except User.DoesNotExist:
                    admin_user = User.objects.create_superuser('admin', 'admin@guava.com', 'admin123')
                
                # Log in the user
                login(request, admin_user, backend='django.contrib.auth.backends.ModelBackend')
        
        return None

