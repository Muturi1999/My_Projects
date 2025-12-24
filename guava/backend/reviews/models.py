"""
Review models: ProductReview.
"""
from django.db import models
from django.core.validators import MinValueValidator, MaxValueValidator
from django.db.models import Avg, Count
from accounts.models import User
from products.models import Product


class ProductReview(models.Model):
    """Product review and rating model."""
    product = models.ForeignKey(Product, on_delete=models.CASCADE, related_name='reviews')
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name='reviews')
    
    rating = models.IntegerField(validators=[MinValueValidator(1), MaxValueValidator(5)])
    title = models.CharField(max_length=200, blank=True, null=True)
    comment = models.TextField(blank=True, null=True)
    
    is_verified_purchase = models.BooleanField(default=False)
    is_approved = models.BooleanField(default=True)
    
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    
    class Meta:
        unique_together = [['product', 'user']]
        ordering = ['-created_at']
        indexes = [
            models.Index(fields=['product', 'rating']),
            models.Index(fields=['user', 'created_at']),
        ]
    
    def save(self, *args, **kwargs):
        super().save(*args, **kwargs)
        # Update product rating
        self.update_product_rating()
    
    def delete(self, *args, **kwargs):
        product = self.product
        super().delete(*args, **kwargs)
        # Update product rating after deletion
        self.update_product_rating_for_product(product)
    
    @staticmethod
    def update_product_rating_for_product(product):
        """Update product rating and rating count."""
        stats = ProductReview.objects.filter(product=product, is_approved=True).aggregate(
            avg_rating=Avg('rating'),
            count=Count('id')
        )
        product.rating = round(stats['avg_rating'] or 0, 2)
        product.rating_count = stats['count'] or 0
        product.save(update_fields=['rating', 'rating_count'])
    
    def update_product_rating(self):
        """Update product rating after save."""
        self.update_product_rating_for_product(self.product)
    
    def __str__(self):
        return f"{self.user.email} - {self.product.name} ({self.rating}/5)"

