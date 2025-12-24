"""
Serializers for reviews app.
"""
from rest_framework import serializers
from .models import ProductReview
from accounts.serializers import UserSerializer


class ProductReviewSerializer(serializers.ModelSerializer):
    """Serializer for ProductReview model."""
    user = UserSerializer(read_only=True)
    user_email = serializers.EmailField(source='user.email', read_only=True)
    
    class Meta:
        model = ProductReview
        fields = ('id', 'product', 'user', 'user_email', 'rating', 'title', 'comment',
                  'is_verified_purchase', 'is_approved', 'created_at', 'updated_at')
        read_only_fields = ('id', 'user', 'created_at', 'updated_at')
    
    def validate(self, attrs):
        """Ensure one review per user per product."""
        user = self.context['request'].user
        product = attrs.get('product') or (self.instance.product if self.instance else None)
        
        if product and user.is_authenticated:
            existing_review = ProductReview.objects.filter(product=product, user=user).exclude(
                pk=self.instance.pk if self.instance else None
            ).first()
            if existing_review:
                raise serializers.ValidationError('You have already reviewed this product.')
        
        return attrs
    
    def create(self, validated_data):
        """Create review with current user."""
        validated_data['user'] = self.context['request'].user
        return super().create(validated_data)

