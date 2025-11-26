"""
Inventory models for commands (write side of CQRS).
"""
import sys
from pathlib import Path

BASE_DIR = Path(__file__).resolve().parent.parent.parent.parent.parent
sys.path.insert(0, str(BASE_DIR / 'backend' / 'shared'))

from django.db import models
from shared.common.models import BaseModel


class Warehouse(BaseModel):
    """
    Warehouse model.
    """
    name = models.CharField(max_length=255)
    address = models.TextField(blank=True)
    city = models.CharField(max_length=100, blank=True)
    is_active = models.BooleanField(default=True)
    
    class Meta:
        db_table = 'inventory_warehouse'
    
    def __str__(self):
        return self.name


class Stock(BaseModel):
    """
    Stock model for product inventory.
    """
    product_id = models.UUIDField(db_index=True)  # Reference to products service
    warehouse = models.ForeignKey(Warehouse, on_delete=models.CASCADE, related_name='stocks')
    quantity = models.IntegerField(default=0, db_index=True)
    reserved_quantity = models.IntegerField(default=0)  # Reserved for orders
    low_stock_threshold = models.IntegerField(default=10)  # Alert when stock is below this
    
    class Meta:
        db_table = 'inventory_stock'
        unique_together = ['product_id', 'warehouse']
        indexes = [
            models.Index(fields=['product_id', 'warehouse']),
        ]
    
    def __str__(self):
        return f"Stock for {self.product_id} at {self.warehouse.name}"
    
    @property
    def available_quantity(self):
        """Available quantity (total - reserved)"""
        return self.quantity - self.reserved_quantity
    
    def is_low_stock(self):
        """Check if stock is below threshold"""
        return self.available_quantity <= self.low_stock_threshold


class StockMovement(BaseModel):
    """
    Stock movement history (in/out transactions).
    """
    MOVEMENT_TYPES = [
        ('in', 'Stock In'),
        ('out', 'Stock Out'),
        ('adjustment', 'Adjustment'),
        ('reserved', 'Reserved'),
        ('released', 'Released'),
    ]
    
    stock = models.ForeignKey(Stock, on_delete=models.CASCADE, related_name='movements')
    movement_type = models.CharField(max_length=20, choices=MOVEMENT_TYPES)
    quantity = models.IntegerField()
    previous_quantity = models.IntegerField()
    new_quantity = models.IntegerField()
    reference = models.CharField(max_length=255, blank=True)  # Order ID, adjustment ID, etc.
    notes = models.TextField(blank=True)
    
    class Meta:
        db_table = 'inventory_stockmovement'
        ordering = ['-created_at']
    
    def __str__(self):
        return f"{self.movement_type} - {self.quantity} units"


