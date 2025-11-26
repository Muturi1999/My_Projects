"""
Custom middleware for API Gateway error handling.
"""
import logging
import traceback
from django.http import JsonResponse
from django.conf import settings
from django.utils.deprecation import MiddlewareMixin

logger = logging.getLogger(__name__)


class ErrorHandlingMiddleware(MiddlewareMixin):
    """
    Middleware to catch and format errors for API Gateway.
    """
    
    def process_exception(self, request, exception):
        """Handle exceptions and return JSON error response"""
        logger.error(
            f"Unhandled exception: {exception}",
            exc_info=True,
            extra={'request': request}
        )
        
        # Get traceback for debugging
        if hasattr(settings, 'DEBUG') and settings.DEBUG:
            error_detail = {
                'error': str(exception),
                'type': type(exception).__name__,
                'traceback': traceback.format_exc().split('\n')
            }
        else:
            error_detail = {
                'error': 'Internal server error',
                'message': 'An unexpected error occurred'
            }
        
        return JsonResponse(error_detail, status=500)

