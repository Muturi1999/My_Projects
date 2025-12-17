"""
Custom admin views that bypass authentication.
"""
from django.contrib.auth import login
from django.contrib.auth import get_user_model
from django.shortcuts import redirect
from django.views.decorators.cache import never_cache
from django.views.decorators.csrf import csrf_exempt

User = get_user_model()


@never_cache
@csrf_exempt
def admin_login_bypass(request):
    """
    Bypass admin login and automatically authenticate as admin user.
    No credentials required - automatically logs in as admin.
    """
    # Get or create admin user
    try:
        admin_user = User.objects.get(username='admin')
    except User.DoesNotExist:
        admin_user = User.objects.create_superuser('admin', 'admin@guava.com', 'admin123')
    
    # Log in the user without requiring credentials
    login(request, admin_user, backend='django.contrib.auth.backends.ModelBackend')
    
    # Redirect to admin index
    return redirect('/admin/')


@never_cache
@csrf_exempt
def admin_logout_bypass(request):
    """
    Bypass logout - just redirect back to admin (auto-login again).
    """
    return redirect('/admin/')

