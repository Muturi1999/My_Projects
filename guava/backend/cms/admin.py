"""
Django admin configuration for CMS app.
"""
from django.contrib import admin
from .models import HomepageSection, HeroSlide


@admin.register(HomepageSection)
class HomepageSectionAdmin(admin.ModelAdmin):
    list_display = ('section_type', 'title', 'is_active', 'order', 'created_at')
    list_filter = ('section_type', 'is_active', 'created_at')
    search_fields = ('title', 'description')
    filter_horizontal = ('products',)
    ordering = ('order', 'section_type')


@admin.register(HeroSlide)
class HeroSlideAdmin(admin.ModelAdmin):
    list_display = ('title', 'is_active', 'order', 'created_at')
    list_filter = ('is_active', 'created_at')
    search_fields = ('title', 'description')
    ordering = ('order', 'created_at')

