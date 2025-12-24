"""
Custom exception handlers for DRF.
"""
from rest_framework.views import exception_handler
from rest_framework.response import Response
from rest_framework import status


def custom_exception_handler(exc, context):
    """
    Custom exception handler that provides consistent error responses.
    """
    response = exception_handler(exc, context)
    
    if response is not None:
        custom_response_data = {
            'error': True,
            'message': 'An error occurred',
            'detail': response.data,
        }
        
        # Handle validation errors
        if isinstance(response.data, dict):
            if 'detail' in response.data:
                custom_response_data['message'] = str(response.data['detail'])
            elif 'non_field_errors' in response.data:
                custom_response_data['message'] = response.data['non_field_errors'][0]
            else:
                # Extract first error message
                for field, errors in response.data.items():
                    if isinstance(errors, list) and len(errors) > 0:
                        custom_response_data['message'] = f"{field}: {errors[0]}"
                        break
        
        response.data = custom_response_data
    
    return response

