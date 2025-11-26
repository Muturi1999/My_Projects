"""
Filters for product queries.
"""
import django_filters
from .models import Product


class ProductFilter(django_filters.FilterSet):
    """
    Filter set for product queries.
    """
    category = django_filters.CharFilter(field_name='category_slug', lookup_expr='iexact')
    brand = django_filters.CharFilter(field_name='brand_slug', lookup_expr='iexact')
    hot = django_filters.BooleanFilter(field_name='hot')
    featured = django_filters.BooleanFilter(field_name='featured')
    min_price = django_filters.NumberFilter(field_name='price', lookup_expr='gte')
    max_price = django_filters.NumberFilter(field_name='price', lookup_expr='lte')
    min_rating = django_filters.NumberFilter(field_name='rating', lookup_expr='gte')
    in_stock = django_filters.BooleanFilter(field_name='stock_quantity', lookup_expr='gt')
    search = django_filters.CharFilter(field_name='name', lookup_expr='icontains')
    
    class Meta:
        model = Product
        fields = ['category', 'brand', 'hot', 'featured', 'min_price', 'max_price', 'min_rating', 'in_stock']


