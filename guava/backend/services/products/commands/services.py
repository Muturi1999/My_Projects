"""
Business logic services for product commands.
"""
import sys
from pathlib import Path

BASE_DIR = Path(__file__).resolve().parent.parent.parent.parent.parent
sys.path.insert(0, str(BASE_DIR / 'backend' / 'shared'))

from typing import Dict, Any
from .models import Product
from shared.messaging.publisher import ProductEventPublisher
from shared.exceptions.exceptions import ValidationException, NotFoundException


class ProductCommandService:
    """
    Service class for product command operations.
    """
    
    def __init__(self):
        self.event_publisher = ProductEventPublisher()
    
    def create_product(self, product_data: Dict[str, Any]) -> Product:
        """
        Create a new product and publish event.
        
        Args:
            product_data: Product data dictionary
            
        Returns:
            Created Product instance
        """
        # Validate slug uniqueness
        if Product.objects.filter(slug=product_data['slug']).exists():
            raise ValidationException(f"Product with slug '{product_data['slug']}' already exists")
        
        product = Product.objects.create(**product_data)
        
        # Publish event
        with self.event_publisher:
            self.event_publisher.product_created(
                str(product.id),
                self._serialize_product(product)
            )
        
        return product
    
    def update_product(self, product_id: str, product_data: Dict[str, Any]) -> Product:
        """
        Update an existing product and publish event.
        
        Args:
            product_id: Product UUID
            product_data: Updated product data
            
        Returns:
            Updated Product instance
        """
        try:
            product = Product.objects.get(id=product_id, is_active=True)
        except Product.DoesNotExist:
            raise NotFoundException(f"Product with id '{product_id}' not found")
        
        # Update fields
        for key, value in product_data.items():
            setattr(product, key, value)
        product.save()
        
        # Publish event
        with self.event_publisher:
            self.event_publisher.product_updated(
                str(product.id),
                self._serialize_product(product)
            )
        
        return product
    
    def delete_product(self, product_id: str) -> None:
        """
        Soft delete a product and publish event.
        
        Args:
            product_id: Product UUID
        """
        try:
            product = Product.objects.get(id=product_id, is_active=True)
        except Product.DoesNotExist:
            raise NotFoundException(f"Product with id '{product_id}' not found")
        
        product.soft_delete()
        
        # Publish event
        with self.event_publisher:
            self.event_publisher.product_deleted(str(product.id))
    
    def _serialize_product(self, product: Product) -> Dict[str, Any]:
        """Serialize product for event publishing"""
        return {
            'name': product.name,
            'slug': product.slug,
            'price': float(product.price),
            'original_price': float(product.original_price),
            'category_slug': product.category_slug,
            'brand_slug': product.brand_slug,
            'hot': product.hot,
        }

