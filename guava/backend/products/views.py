"""
Views for products app.
"""
from rest_framework import viewsets, filters, status
from rest_framework.decorators import action
from rest_framework.response import Response
from rest_framework.permissions import AllowAny, IsAuthenticated
from django_filters.rest_framework import DjangoFilterBackend
from django.db.models import Q, Sum
from .models import Category, Brand, Product, ProductVariant, ProductImage, ProductSpecification
from .serializers import (
    CategorySerializer,
    BrandSerializer,
    ProductSerializer,
    ProductListSerializer
)
from .permissions import IsAdminOrReadOnly, IsAdminOrStaff


class CategoryViewSet(viewsets.ModelViewSet):
    """ViewSet for Category model - Full CRUD for admin, read-only for others."""
    queryset = Category.objects.all()
    serializer_class = CategorySerializer
    # Temporarily allow unauthenticated writes for development (remove when auth is integrated)
    permission_classes = [AllowAny]  # Change back to [IsAdminOrReadOnly] when auth is integrated
    lookup_field = 'slug'
    search_fields = ['name', 'slug']
    filter_backends = [filters.SearchFilter, filters.OrderingFilter]
    ordering = ['order', 'name']


class BrandViewSet(viewsets.ModelViewSet):
    """ViewSet for Brand model - Full CRUD for admin, read-only for others."""
    queryset = Brand.objects.all()
    serializer_class = BrandSerializer
    # Temporarily allow unauthenticated writes for development (remove when auth is integrated)
    permission_classes = [AllowAny]  # Change back to [IsAdminOrReadOnly] when auth is integrated
    lookup_field = 'slug'
    search_fields = ['name', 'slug']
    filter_backends = [filters.SearchFilter, filters.OrderingFilter]


class ProductViewSet(viewsets.ModelViewSet):
    """ViewSet for Product model - Full CRUD for admin/staff, read-only for others."""
    queryset = Product.objects.prefetch_related('variants', 'product_images', 'specifications').all()
    # Temporarily allow unauthenticated writes for development (remove when auth is integrated)
    permission_classes = [AllowAny]  # Change back to [IsAdminOrReadOnly] when auth is integrated
    lookup_field = 'slug'
    filter_backends = [DjangoFilterBackend, filters.SearchFilter, filters.OrderingFilter]
    filterset_fields = ['category', 'brand', 'hot', 'featured', 'condition']
    search_fields = ['name', 'description', 'category__name', 'brand__name', 'sku', 'tags']
    ordering_fields = ['price', 'rating', 'created_at', 'name']
    ordering = ['-created_at']
    
    def get_serializer_class(self):
        if self.action == 'list':
            return ProductListSerializer
        return ProductSerializer
    
    def create(self, request, *args, **kwargs):
        """Create product with additional data handling."""
        # Extract data that's not in the main serializer
        data = request.data.copy()
        
        # Map frontend fields to serializer fields
        # stock_quantity -> stock_quantity_write (mandatory)
        if 'stock_quantity' in data:
            data['stock_quantity_write'] = data.pop('stock_quantity')
        
        # primary_image or images[0] -> image_url_write (mandatory)
        if 'primary_image' in data and data['primary_image']:
            data['image_url_write'] = data.pop('primary_image')
        elif 'images' in data and isinstance(data['images'], list) and len(data['images']) > 0:
            # Use first image as primary
            first_image = data['images'][0]
            if isinstance(first_image, str):
                data['image_url_write'] = first_image
            elif isinstance(first_image, dict) and 'image_url' in first_image:
                data['image_url_write'] = first_image['image_url']
        
        images_data = data.pop('images', [])
        feature_list = data.pop('feature_list', [])
        
        # Debug: Log the data being sent to serializer
        print(f"[ProductViewSet] Data being sent to serializer: {data}")
        print(f"[ProductViewSet] category_slug_write: {data.get('category_slug_write')}")
        print(f"[ProductViewSet] brand_slug_write: {data.get('brand_slug_write')}")
        print(f"[ProductViewSet] stock_quantity_write: {data.get('stock_quantity_write')}")
        print(f"[ProductViewSet] image_url_write: {data.get('image_url_write')}")
        
        # Pass stock_quantity and image_url to serializer context
        serializer = self.get_serializer(data=data)
        serializer.is_valid(raise_exception=True)
        
        # Create product (this will also create the variant with stock_quantity)
        product = serializer.save()
        
        # Create product images
        if images_data:
            from .models import ProductImage
            for idx, img_data in enumerate(images_data):
                if isinstance(img_data, dict):
                    ProductImage.objects.create(
                        product=product,
                        image_url=img_data.get('image_url', ''),
                        alt_text=img_data.get('alt_text', product.name),
                        order=img_data.get('order', idx)
                    )
                elif isinstance(img_data, str):
                    # If it's just a URL string
                    ProductImage.objects.create(
                        product=product,
                        image_url=img_data,
                        alt_text=product.name,
                        order=idx
                    )
        
        # Create/update specifications with features
        if feature_list:
            from .models import ProductSpecification
            spec, created = ProductSpecification.objects.get_or_create(product=product)
            spec.features = feature_list if isinstance(feature_list, list) else []
            spec.save()
        
        # Reload product with all relationships
        product.refresh_from_db()
        serializer = self.get_serializer(product)
        headers = self.get_success_headers(serializer.data)
        return Response(serializer.data, status=status.HTTP_201_CREATED, headers=headers)
    
    def get_queryset(self):
        queryset = super().get_queryset()
        
        # Filter by category slug
        category_slug = self.request.query_params.get('category_slug')
        if category_slug:
            queryset = queryset.filter(category__slug=category_slug)
        
        # Filter by brand slug
        brand_slug = self.request.query_params.get('brand_slug')
        if brand_slug:
            queryset = queryset.filter(brand__slug=brand_slug)
        
        # Price range filter
        min_price = self.request.query_params.get('min_price')
        max_price = self.request.query_params.get('max_price')
        if min_price:
            queryset = queryset.filter(price__gte=min_price)
        if max_price:
            queryset = queryset.filter(price__lte=max_price)
        
        # Rating filter
        min_rating = self.request.query_params.get('min_rating')
        if min_rating:
            queryset = queryset.filter(rating__gte=min_rating)
        
        # In stock filter (has active variants with stock > 0)
        in_stock = self.request.query_params.get('in_stock')
        if in_stock and in_stock.lower() == 'true':
            queryset = queryset.filter(variants__is_active=True, variants__stock_quantity__gt=0).distinct()
        
        return queryset
    
    @action(detail=False, methods=['get'])
    def hot_deals(self, request):
        """Get hot deals products."""
        products = self.get_queryset().filter(hot=True)
        page = self.paginate_queryset(products)
        if page is not None:
            serializer = self.get_serializer(page, many=True)
            return self.get_paginated_response(serializer.data)
        serializer = self.get_serializer(products, many=True)
        return Response(serializer.data)
    
    @action(detail=False, methods=['get'], url_path='by-category/(?P<category_slug>[^/.]+)')
    def by_category(self, request, category_slug=None):
        """Get products by category slug."""
        products = self.get_queryset().filter(category__slug=category_slug)
        page = self.paginate_queryset(products)
        if page is not None:
            serializer = self.get_serializer(page, many=True)
            return self.get_paginated_response(serializer.data)
        serializer = self.get_serializer(products, many=True)
        return Response(serializer.data)
    
    @action(detail=False, methods=['get'], url_path='by-brand/(?P<brand_slug>[^/.]+)')
    def by_brand(self, request, brand_slug=None):
        """Get products by brand slug."""
        products = self.get_queryset().filter(brand__slug=brand_slug)
        page = self.paginate_queryset(products)
        if page is not None:
            serializer = self.get_serializer(page, many=True)
            return self.get_paginated_response(serializer.data)
        serializer = self.get_serializer(products, many=True)
        return Response(serializer.data)
    
    @action(detail=False, methods=['get'])
    def search(self, request):
        """Search products."""
        query = request.query_params.get('q', '')
        if not query:
            return Response({'results': [], 'count': 0})
        
        products = self.get_queryset().filter(
            Q(name__icontains=query) |
            Q(description__icontains=query) |
            Q(category__name__icontains=query) |
            Q(brand__name__icontains=query)
        ).distinct()
        
        page = self.paginate_queryset(products)
        if page is not None:
            serializer = self.get_serializer(page, many=True)
            return self.get_paginated_response(serializer.data)
        serializer = self.get_serializer(products, many=True)
        return Response(serializer.data)

