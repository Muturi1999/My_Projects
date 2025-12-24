"""
Inventory models: SerialNumber, IMEI tracking.
"""
from django.db import models
from django.core.exceptions import ValidationError
from products.models import ProductVariant


class SerialNumber(models.Model):
    """Serial number / IMEI tracking for inventory units."""
    variant = models.ForeignKey(ProductVariant, on_delete=models.PROTECT, related_name='serial_numbers')
    serial_number = models.CharField(max_length=200, unique=True, db_index=True)
    imei = models.CharField(max_length=200, unique=True, null=True, blank=True, db_index=True)
    
    # Assignment tracking (using string reference to avoid circular import)
    order_item = models.ForeignKey('orders.OrderItem', on_delete=models.SET_NULL, null=True, blank=True, related_name='serial_numbers')
    assigned_at = models.DateTimeField(null=True, blank=True)
    
    # Status
    STATUS_CHOICES = [
        ('available', 'Available'),
        ('reserved', 'Reserved'),
        ('sold', 'Sold'),
        ('returned', 'Returned'),
    ]
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default='available')
    
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    
    class Meta:
        unique_together = [['serial_number'], ['imei']]
        indexes = [
            models.Index(fields=['serial_number']),
            models.Index(fields=['imei']),
            models.Index(fields=['status']),
        ]
    
    def clean(self):
        """Validate that serial_number or imei is provided."""
        if not self.serial_number and not self.imei:
            raise ValidationError('Either serial_number or imei must be provided.')
    
    def save(self, *args, **kwargs):
        self.full_clean()
        super().save(*args, **kwargs)
    
    def __str__(self):
        return f"{self.serial_number or self.imei} ({self.variant.product.name})"

