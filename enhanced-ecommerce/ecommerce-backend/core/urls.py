# ecommerce-backend/core/urls.py

from django.contrib import admin
from django.urls import path, include
from rest_framework.routers import DefaultRouter
from rest_framework_simplejwt.views import TokenObtainPairView, TokenRefreshView
from accounts.views import WishlistView

# Account Views
from accounts.views import RegisterView, ProfileView, AddressViewSet
from cms.views import CategoryViewSet, PostViewSet, StaticPageViewSet

# Store / Core Views
from core.views import ProductViewSet, CategoryViewSet, CartViewSet
from store.views import CheckoutView, OrderViewSet  # Add OrderViewSet later for My Orders
from store.views import ProductViewSet, CategoryViewSet, CartViewSet, OrderViewSet
from accounts.views import AddressViewSet # Assuming AddressViewSet is already imported/registered
from store.views import ReviewViewSet

# ----------------------------
# DRF Router
# ----------------------------
router = DefaultRouter()
router.register(r'products', ProductViewSet)
router.register(r'categories', CategoryViewSet)
router.register(r'cart', CartViewSet, basename='cart')
router.register(r'addresses', AddressViewSet, basename='address')
router.register(r'orders', OrderViewSet, basename='order')  # Optional: My Orders endpoint
router.register(r'orders', OrderViewSet, basename='order') # Add Order ViewSet
router.register(r'reviews', ReviewViewSet, basename='review')
router.register(r'blog/categories', CategoryViewSet, basename='blog-category')
router.register(r'blog/posts', PostViewSet, basename='blog-post')
router.register(r'cms/pages', StaticPageViewSet, basename='cms-page')

# ----------------------------
# URL Patterns
# ----------------------------
urlpatterns = [
    # Admin
    path('admin/', admin.site.urls),
    path('api/', include(router.urls)),
    # JWT Authentication
    path('api/auth/login/', TokenObtainPairView.as_view(), name='token_obtain_pair'),
    path('api/auth/refresh/', TokenRefreshView.as_view(), name='token_refresh'),

    # Account endpoints
    path('api/auth/register/', RegisterView.as_view(), name='account_register'),
    path('api/account/profile/', ProfileView.as_view(), name='account_profile'),

    # Checkout
    path('api/checkout/process/', CheckoutView.as_view(), name='checkout_process'),
    path('api/search/suggest/', SearchSuggestionView.as_view(), name='search_suggest'),
    
    path('api/admin/metrics/', SalesMetricsView.as_view(), name='admin_metrics'),
    path('api/admin/inventory/low_stock/', LowStockAlertsView.as_view(), name='low_stock_alerts'),
    # Include router URLs (products, categories, cart, addresses, orders)
    path('api/wishlist/', WishlistView.as_view(), name='wishlist_management'),

    path('api/payments/card/', StripePaymentView.as_view(), name='payment_card'),
    path('api/payments/mpesa/', MpesaPaymentView.as_view(), name='payment_mpesa'),
    path('api/payments/mpesa_callback/', MpesaCallbackView.as_view(), name='mpesa_callback'),
    path('api/coupons/apply/', CouponApplyView.as_view(), name='apply_coupon'),

    path('api/payments/intent/create/', CreatePaymentIntentView.as_view(), name='create_payment_intent'),

    path('api/admin/orders/refund/', RefundView.as_view(), name='order_refund'),
    path('api/', include(router.urls)),
]
