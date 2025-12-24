"""
CMS models: Homepage sections, hero slides, etc.
"""
from django.db import models
from django.core.validators import MinValueValidator, MaxValueValidator
from products.models import Product, Category, Brand


class HomepageSection(models.Model):
    """Homepage section model (hot deals, printer deals, etc.)."""
    SECTION_TYPE_CHOICES = [
        ('hot_deals', 'Hot Deals'),
        ('laptop_deals', 'Laptop Deals'),
        ('printer_scanner', 'Printer & Scanner Deals'),
        ('accessories', 'Accessories Deals'),
        ('audio', 'Audio & Headphones Deals'),
        ('popular_brands', 'Popular Brands'),
        ('popular_categories', 'Popular Categories'),
        ('featured', 'Featured Deals'),
    ]
    
    section_type = models.CharField(max_length=50, choices=SECTION_TYPE_CHOICES, unique=True)
    title = models.CharField(max_length=200)
    description = models.TextField(blank=True, null=True)
    is_active = models.BooleanField(default=True)
    order = models.IntegerField(default=0)
    
    # Products in this section
    products = models.ManyToManyField(Product, blank=True, related_name='homepage_sections')
    
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    
    class Meta:
        ordering = ['order', 'section_type']
    
    def __str__(self):
        return f"{self.get_section_type_display()} - {self.title}"


class HeroSlide(models.Model):
    """Hero banner slide model."""
    title = models.CharField(max_length=200)
    description = models.TextField(blank=True, null=True)
    cta_label = models.CharField(max_length=100, blank=True, null=True)
    cta_href = models.CharField(max_length=500, blank=True, null=True)
    image = models.ImageField(upload_to='hero/', blank=True, null=True)
    image_url = models.URLField(blank=True, null=True)
    badge = models.CharField(max_length=100, blank=True, null=True)
    is_active = models.BooleanField(default=True)
    order = models.IntegerField(default=0)
    
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    
    class Meta:
        ordering = ['order', 'created_at']
    
    def __str__(self):
        return self.title

