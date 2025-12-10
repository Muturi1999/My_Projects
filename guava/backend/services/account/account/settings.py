"""
Django settings for account service.
"""
import os
from pathlib import Path
from dotenv import load_dotenv

# Load environment variables
BASE_DIR = Path(__file__).resolve().parent.parent.parent.parent.parent
load_dotenv(BASE_DIR / '.env')

# Import shared config
import sys
sys.path.insert(0, str(BASE_DIR / 'backend' / 'shared'))
from config.env import get_database_config, get_rabbitmq_config, get_redis_config

# SECURITY WARNING: keep the secret key used in production secret!
SECRET_KEY = os.getenv('SECRET_KEY', 'django-insecure-change-in-production')

# SECURITY WARNING: don't run with debug turned on in production!
DEBUG = os.getenv('APP_DEBUG', 'True') == 'True'

ALLOWED_HOSTS = ['*']  # Configure appropriately for production

# Application definition
INSTALLED_APPS = [
    'django.contrib.admin',
    'django.contrib.auth',
    'django.contrib.contenttypes',
    'django.contrib.sessions',
    'django.contrib.messages',
    'django.contrib.staticfiles',
    'rest_framework',
    'rest_framework.authtoken',
    'django_filters',
    'corsheaders',
    'commands',
    'queries',
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
]

ROOT_URLCONF = 'account.urls'

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

WSGI_APPLICATION = 'account.wsgi.application'

# Database
db_config = get_database_config('ACCOUNT')
DATABASES = {
    'default': {
        'ENGINE': 'django.db.backends.postgresql',
        'NAME': db_config.name,
        'USER': db_config.user,
        'PASSWORD': db_config.password,
        'HOST': db_config.host,
        'PORT': db_config.port,
    }
}

# Custom User Model
AUTH_USER_MODEL = 'commands.User'

# Password validation
AUTH_PASSWORD_VALIDATORS = [
    {
        'NAME': 'django.contrib.auth.password_validation.UserAttributeSimilarityValidator',
    },
    {
        'NAME': 'django.contrib.auth.password_validation.MinimumLengthValidator',
        'OPTIONS': {
            'min_length': 8,
        }
    },
    {
        'NAME': 'django.contrib.auth.password_validation.CommonPasswordValidator',
    },
    {
        'NAME': 'django.contrib.auth.password_validation.NumericPasswordValidator',
    },
]

# Internationalization
LANGUAGE_CODE = 'en-us'
TIME_ZONE = 'UTC'
USE_I18N = True
USE_TZ = True

# Static files (CSS, JavaScript, Images)
STATIC_URL = 'static/'

# Default primary key field type
DEFAULT_AUTO_FIELD = 'django.db.models.BigAutoField'

# REST Framework
REST_FRAMEWORK = {
    'DEFAULT_AUTHENTICATION_CLASSES': [
        'rest_framework.authentication.TokenAuthentication',
        'rest_framework.authentication.SessionAuthentication',
    ],
    'DEFAULT_PERMISSION_CLASSES': [
        'rest_framework.permissions.IsAuthenticated',
    ],
    'DEFAULT_PAGINATION_CLASS': 'shared.common.pagination.StandardResultsSetPagination',
    'PAGE_SIZE': 20,
    'DEFAULT_FILTER_BACKENDS': [
        'django_filters.rest_framework.DjangoFilterBackend',
        'rest_framework.filters.SearchFilter',
        'rest_framework.filters.OrderingFilter',
    ],
    'DEFAULT_RENDERER_CLASSES': [
        'rest_framework.renderers.JSONRenderer',
    ],
    'DEFAULT_PARSER_CLASSES': [
        'rest_framework.parsers.JSONParser',
    ],
}

# RabbitMQ Configuration
rabbitmq_config = get_rabbitmq_config()
CELERY_BROKER_URL = rabbitmq_config.url

# Redis Configuration
redis_config = get_redis_config()
CACHES = {
    'default': {
        'BACKEND': 'django.core.cache.backends.redis.RedisCache',
        'LOCATION': redis_config.url,
    }
}

# CORS settings - uses centralized domain configuration
from config.env import get_app_config
app_config = get_app_config()
CORS_ALLOWED_ORIGINS = [
    app_config.frontend_url,
]

CORS_ALLOW_CREDENTIALS = True

# Email configuration (for sending verification codes)
EMAIL_BACKEND = os.getenv('EMAIL_BACKEND', 'django.core.mail.backends.console.EmailBackend')
EMAIL_HOST = os.getenv('EMAIL_HOST', 'smtp.gmail.com')
EMAIL_PORT = int(os.getenv('EMAIL_PORT', '587'))
EMAIL_USE_TLS = os.getenv('EMAIL_USE_TLS', 'True') == 'True'
EMAIL_HOST_USER = os.getenv('EMAIL_HOST_USER', '')
EMAIL_HOST_PASSWORD = os.getenv('EMAIL_HOST_PASSWORD', '')
DEFAULT_FROM_EMAIL = os.getenv('DEFAULT_FROM_EMAIL', 'noreply@guavastores.com')

# SMS configuration (for sending verification codes via phone)
# Configure your SMS provider here
SMS_PROVIDER = os.getenv('SMS_PROVIDER', 'console')  # console, twilio, etc.
SMS_API_KEY = os.getenv('SMS_API_KEY', '')
SMS_API_SECRET = os.getenv('SMS_API_SECRET', '')

# Verification code settings
VERIFICATION_CODE_LENGTH = 6
VERIFICATION_CODE_EXPIRY_MINUTES = 15
PASSWORD_RESET_TOKEN_EXPIRY_HOURS = 1

