"""
Report models for commands (write side of CQRS).
"""
import sys
from pathlib import Path
from django.utils import timezone

BASE_DIR = Path(__file__).resolve().parent.parent.parent.parent.parent
sys.path.insert(0, str(BASE_DIR / 'backend' / 'shared'))

from django.db import models
from shared.common.models import BaseModel


class SalesReport(BaseModel):
    """
    Sales report model.
    """
    REPORT_TYPES = [
        ('daily', 'Daily'),
        ('weekly', 'Weekly'),
        ('monthly', 'Monthly'),
        ('yearly', 'Yearly'),
        ('custom', 'Custom'),
    ]
    
    report_type = models.CharField(max_length=20, choices=REPORT_TYPES)
    start_date = models.DateTimeField()
    end_date = models.DateTimeField()
    
    # Summary data
    total_orders = models.IntegerField(default=0)
    total_revenue = models.DecimalField(max_digits=12, decimal_places=2, default=0)
    total_items_sold = models.IntegerField(default=0)
    average_order_value = models.DecimalField(max_digits=10, decimal_places=2, default=0)
    
    # Detailed data (JSON)
    order_data = models.JSONField(default=list, blank=True)
    product_data = models.JSONField(default=list, blank=True)
    category_data = models.JSONField(default=list, blank=True)
    
    # Status
    is_generated = models.BooleanField(default=False)
    generated_at = models.DateTimeField(null=True, blank=True)
    
    class Meta:
        db_table = 'reports_salesreport'
        ordering = ['-created_at']
        indexes = [
            models.Index(fields=['report_type', 'start_date', 'end_date']),
        ]
    
    def __str__(self):
        return f"{self.get_report_type_display()} Report ({self.start_date.date()} - {self.end_date.date()})"


class ProductReport(BaseModel):
    """
    Product performance report.
    """
    product_id = models.UUIDField(db_index=True)  # Reference to products service
    product_name = models.CharField(max_length=255)
    
    # Metrics
    total_sold = models.IntegerField(default=0)
    total_revenue = models.DecimalField(max_digits=12, decimal_places=2, default=0)
    average_rating = models.DecimalField(max_digits=3, decimal_places=2, default=0)
    view_count = models.IntegerField(default=0)
    
    # Time period
    period_start = models.DateTimeField()
    period_end = models.DateTimeField()
    
    class Meta:
        db_table = 'reports_productreport'
        ordering = ['-total_revenue']
        indexes = [
            models.Index(fields=['product_id', 'period_start', 'period_end']),
        ]
    
    def __str__(self):
        return f"Product Report: {self.product_name}"


class InventoryReport(BaseModel):
    """
    Inventory report model.
    """
    REPORT_TYPES = [
        ('stock_levels', 'Stock Levels'),
        ('low_stock', 'Low Stock'),
        ('movement', 'Stock Movement'),
        ('valuation', 'Inventory Valuation'),
    ]
    
    report_type = models.CharField(max_length=20, choices=REPORT_TYPES)
    generated_at = models.DateTimeField(auto_now_add=True)
    
    # Report data
    total_products = models.IntegerField(default=0)
    total_value = models.DecimalField(max_digits=12, decimal_places=2, default=0)
    low_stock_count = models.IntegerField(default=0)
    out_of_stock_count = models.IntegerField(default=0)
    
    # Detailed data
    product_data = models.JSONField(default=list, blank=True)
    
    class Meta:
        db_table = 'reports_inventoryreport'
        ordering = ['-generated_at']
    
    def __str__(self):
        return f"{self.get_report_type_display()} - {self.generated_at.date()}"

