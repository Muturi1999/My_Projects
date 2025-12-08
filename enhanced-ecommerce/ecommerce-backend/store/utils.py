# ecommerce-backend/store/utils.py (New file for utility functions)

from .models import Coupon
from django.utils import timezone
from decimal import Decimal

def validate_coupon(coupon_code, cart_total):
    """Validates coupon code against time, usage limits, and cart minimum."""
    
    try:
        coupon = Coupon.objects.get(code__iexact=coupon_code)
    except Coupon.DoesNotExist:
        return (False, "Coupon code is invalid.")

    now = timezone.now()

    if not coupon.active:
        return (False, "Coupon is currently inactive.")
        
    if coupon.valid_from > now:
        return (False, "Coupon is not yet active.")

    if coupon.valid_to < now:
        return (False, "Coupon has expired.")

    if coupon.max_usage_count is not None and coupon.used_count >= coupon.max_usage_count:
        return (False, "Coupon usage limit reached.")

    if cart_total < coupon.minimum_cart_amount:
        return (False, f"Minimum purchase of ${coupon.minimum_cart_amount:.2f} required.")

    return (True, coupon)

def calculate_discount(coupon, cart_total):
    """Calculates the discount amount based on coupon type and value."""
    if coupon.discount_type == 'PERCENTAGE':
        discount_amount = cart_total * (coupon.value / Decimal(100))
    else: # FIXED amount
        # Discount cannot exceed the cart total
        discount_amount = min(coupon.value, cart_total) 
        
    return discount_amount.quantize(Decimal('0.01'))


# ecommerce-backend/core/urls.py (Update URL patterns)
urlpatterns = [
    # ...
    path('api/coupons/apply/', CouponApplyView.as_view(), name='apply_coupon'),
    # ...
]