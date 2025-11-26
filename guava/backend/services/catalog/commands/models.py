"""
Catalog models for commands (write side of CQRS).
"""
import sys
from pathlib import Path

BASE_DIR = Path(__file__).resolve().parent.parent.parent.parent.parent
sys.path.insert(0, str(BASE_DIR / 'backend' / 'shared'))

from django.db import models
from shared.common.models import BaseModel


class Category(BaseModel):
    """
    Category model.
    """
    name = models.CharField(max_length=255, db_index=True)
    slug = models.SlugField(max_length=255, unique=True, db_index=True)
    description = models.TextField(blank=True)
    icon = models.CharField(max_length=100, blank=True)  # Icon name/identifier
    image = models.URLField(max_length=500, blank=True)
    parent = models.ForeignKey(
        'self',
        on_delete=models.CASCADE,
        null=True,
        blank=True,
        related_name='subcategories'
    )
    order = models.IntegerField(default=0)
    
    class Meta:
        db_table = 'catalog_category'
        verbose_name_plural = 'Categories'
        ordering = ['order', 'name']
    
    def __str__(self):
        return self.name


class Brand(BaseModel):
    """
    Brand model.
    """
    name = models.CharField(max_length=255, db_index=True)
    slug = models.SlugField(max_length=255, unique=True, db_index=True)
    logo = models.URLField(max_length=500, blank=True)
    image = models.URLField(max_length=500, blank=True)
    color = models.CharField(max_length=7, blank=True)  # Hex color code
    description = models.TextField(blank=True)
    discount = models.IntegerField(default=0)  # Default discount percentage
    
    class Meta:
        db_table = 'catalog_brand'
        ordering = ['name']
    
    def __str__(self):
        return self.name


class CategoryBrand(BaseModel):
    """
    Many-to-many relationship between categories and brands.
    """
    category = models.ForeignKey(Category, on_delete=models.CASCADE, related_name='brands')
    brand = models.ForeignKey(Brand, on_delete=models.CASCADE, related_name='categories')
    
    class Meta:
        db_table = 'catalog_category_brand'
        unique_together = ['category', 'brand']
    
    def __str__(self):
        return f"{self.category.name} - {self.brand.name}"


