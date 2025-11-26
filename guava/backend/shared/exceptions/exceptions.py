"""
Custom exception classes for all microservices.
"""
from rest_framework import status


class ServiceException(Exception):
    """
    Base exception for all service-level errors.
    """
    def __init__(self, message: str, code: str = None, status_code: int = status.HTTP_500_INTERNAL_SERVER_ERROR):
        self.message = message
        self.code = code or 'SERVICE_ERROR'
        self.status_code = status_code
        super().__init__(self.message)


class ValidationException(ServiceException):
    """
    Exception for validation errors.
    """
    def __init__(self, message: str, code: str = 'VALIDATION_ERROR', errors: dict = None):
        super().__init__(message, code, status.HTTP_400_BAD_REQUEST)
        self.errors = errors or {}


class NotFoundException(ServiceException):
    """
    Exception for resource not found errors.
    """
    def __init__(self, message: str = 'Resource not found', code: str = 'NOT_FOUND'):
        super().__init__(message, code, status.HTTP_404_NOT_FOUND)


class ConflictException(ServiceException):
    """
    Exception for resource conflict errors.
    """
    def __init__(self, message: str = 'Resource conflict', code: str = 'CONFLICT'):
        super().__init__(message, code, status.HTTP_409_CONFLICT)


