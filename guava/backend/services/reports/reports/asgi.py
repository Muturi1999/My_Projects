"""
ASGI config for reports service.
"""
import os
from django.core.asgi import get_asgi_application

os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'reports.settings')

application = get_asgi_application()

