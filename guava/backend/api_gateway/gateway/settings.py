"""
Django settings for API Gateway.
"""
import os
from pathlib import Path
from dotenv import load_dotenv

BASE_DIR = Path(__file__).resolve().parent.parent.parent.parent
env_file = BASE_DIR / '.env'
load_dotenv(env_file)

import sys
sys.path.insert(0, str(BASE_DIR / 'backend' / 'shared'))

# Try to get app config, but provide defaults if .env doesn't exist
try:
    from config.env import get_app_config
    app_config = get_app_config()
except Exception as e:
    # If .env doesn't exist or config fails, use defaults
    import warnings
    warnings.warn(f"Could not load app config: {e}. Using default ports.")
    
    class DefaultConfig:
        products_service_port = 8001
        catalog_service_port = 8002
        cms_service_port = 8003
        orders_service_port = 8004
        inventory_service_port = 8005
        promotions_service_port = 8006
        reports_service_port = 8007
    
    app_config = DefaultConfig()

SECRET_KEY = os.getenv('SECRET_KEY', 'django-insecure-change-in-production')
DEBUG = os.getenv('APP_DEBUG', 'True') == 'True'
ALLOWED_HOSTS = ['*']

INSTALLED_APPS = [
    'django.contrib.admin',
    'django.contrib.auth',
    'django.contrib.contenttypes',
    'django.contrib.sessions',
    'django.contrib.messages',
    'django.contrib.staticfiles',
    'rest_framework',
    'corsheaders',
    'gateway',
]

MIDDLEWARE = [
    'corsheaders.middleware.CorsMiddleware',
    'django.middleware.security.SecurityMiddleware',
    'django.contrib.sessions.middleware.SessionMiddleware',
    'django.middleware.common.CommonMiddleware',
    'django.middleware.csrf.CsrfViewMiddleware',
    'django.contrib.auth.middleware.AuthenticationMiddleware',
    'django.contrib.messages.middleware.MessageMiddleware',
    'django.middleware.clickjacking.XFrameOptionsMiddleware',
    'gateway.middleware.ErrorHandlingMiddleware',
]

ROOT_URLCONF = 'gateway.urls'

TEMPLATES = [
    {
        'BACKEND': 'django.template.backends.django.DjangoTemplates',
        'DIRS': [],
        'APP_DIRS': True,
        'OPTIONS': {
            'context_processors': [
                'django.template.context_processors.debug',
                'django.template.context_processors.request',
                'django.contrib.auth.context_processors.auth',
                'django.contrib.messages.context_processors.messages',
            ],
        },
    },
]

WSGI_APPLICATION = 'gateway.wsgi.application'

# API Gateway doesn't need a database, but Django requires one
DATABASES = {
    'default': {
        'ENGINE': 'django.db.backends.sqlite3',
        'NAME': BASE_DIR / 'db.sqlite3',
    }
}

AUTH_PASSWORD_VALIDATORS = []

LANGUAGE_CODE = 'en-us'
TIME_ZONE = 'UTC'
USE_I18N = True
USE_TZ = True

STATIC_URL = 'static/'
DEFAULT_AUTO_FIELD = 'django.db.models.BigAutoField'

REST_FRAMEWORK = {
    'DEFAULT_RENDERER_CLASSES': [
        'rest_framework.renderers.JSONRenderer',
    ],
    'DEFAULT_PARSER_CLASSES': [
        'rest_framework.parsers.JSONParser',
    ],
}

# CORS settings - uses centralized domain configuration
CORS_ALLOWED_ORIGINS = [
    app_config.frontend_url,
]

CORS_ALLOW_CREDENTIALS = True

# Service URLs - uses centralized domain configuration
# Change DOMAIN in .env file to switch from localhost to production domain
protocol = "https" if app_config.app_env == "production" else "http"
SERVICE_URLS = {
    'products': f'{protocol}://{app_config.domain}:{app_config.products_service_port}',
    'catalog': f'{protocol}://{app_config.domain}:{app_config.catalog_service_port}',
    'cms': f'{protocol}://{app_config.domain}:{app_config.cms_service_port}',
    'orders': f'{protocol}://{app_config.domain}:{app_config.orders_service_port}',
    'inventory': f'{protocol}://{app_config.domain}:{app_config.inventory_service_port}',
    'promotions': f'{protocol}://{app_config.domain}:{app_config.promotions_service_port}',
    'reports': f'{protocol}://{app_config.domain}:{app_config.reports_service_port}',
    'account': f'{protocol}://{app_config.domain}:{app_config.account_service_port}',
}


