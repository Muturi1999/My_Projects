"""
CMS models for commands (write side of CQRS).
"""
import sys
from pathlib import Path

BASE_DIR = Path(__file__).resolve().parent.parent.parent.parent.parent
sys.path.insert(0, str(BASE_DIR / 'backend' / 'shared'))

from django.db import models
from shared.common.models import BaseModel


class Homepage(BaseModel):
    """
    Homepage configuration.
    """
    title = models.CharField(max_length=255, default='Homepage')
    description = models.TextField(blank=True)
    hero_slides = models.JSONField(default=list)  # Array of hero slide objects
    shop_by_category = models.JSONField(default=dict)  # Shop by category configuration
    featured_deals = models.JSONField(default=dict)  # Featured deals configuration
    custom_sections = models.JSONField(default=list)  # Array of custom sections
    
    class Meta:
        db_table = 'cms_homepage'
        verbose_name_plural = 'Homepages'
    
    def __str__(self):
        return self.title


class Navigation(BaseModel):
    """
    Navigation menu configuration.
    """
    name = models.CharField(max_length=255, default='Main Navigation')
    items = models.JSONField(default=list)  # Array of navigation items
    footer_items = models.JSONField(default=list)  # Footer navigation items
    
    class Meta:
        db_table = 'cms_navigation'
        verbose_name_plural = 'Navigations'
    
    def __str__(self):
        return self.name


class Footer(BaseModel):
    """
    Footer configuration.
    """
    copyright_text = models.CharField(max_length=255, default='')
    social_links = models.JSONField(default=dict)  # Social media links
    columns = models.JSONField(default=list)  # Footer columns with links
    payment_methods = models.JSONField(default=list)  # Payment method icons
    
    class Meta:
        db_table = 'cms_footer'
        verbose_name_plural = 'Footers'
    
    def __str__(self):
        return 'Footer Configuration'


class ServiceGuarantee(BaseModel):
    """
    Service guarantee/feature card.
    """
    title = models.CharField(max_length=255)
    description = models.TextField(blank=True)
    icon = models.CharField(max_length=100)  # Icon identifier
    order = models.IntegerField(default=0)
    
    class Meta:
        db_table = 'cms_serviceguarantee'
        ordering = ['order']
    
    def __str__(self):
        return self.title


