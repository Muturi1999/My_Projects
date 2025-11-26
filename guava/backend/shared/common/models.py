"""
Base models with common fields for all microservices.
"""
import uuid
from django.db import models
from django.utils import timezone


class BaseModel(models.Model):
    """
    Abstract base model with UUID primary key and timestamps.
    All models should inherit from this.
    """
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    created_at = models.DateTimeField(auto_now_add=True, db_index=True)
    updated_at = models.DateTimeField(auto_now=True, db_index=True)
    is_active = models.BooleanField(default=True, db_index=True)
    
    class Meta:
        abstract = True
        ordering = ['-created_at']
    
    def soft_delete(self):
        """Soft delete by setting is_active to False"""
        self.is_active = False
        self.save(update_fields=['is_active', 'updated_at'])


class TimestampedModel(models.Model):
    """
    Model with only timestamps (no UUID, for cases where you need auto-increment ID).
    """
    created_at = models.DateTimeField(auto_now_add=True, db_index=True)
    updated_at = models.DateTimeField(auto_now=True, db_index=True)
    
    class Meta:
        abstract = True
        ordering = ['-created_at']


