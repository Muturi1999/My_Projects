"""
Product models: Category, Brand, Product, ProductVariant, ProductImage, ProductSpecification.
"""
from django.db import models
from django.utils.text import slugify
from django.core.validators import MinValueValidator, MaxValueValidator


class Category(models.Model):
    """Product category model."""
    name = models.CharField(max_length=200, unique=True)
    slug = models.SlugField(max_length=200, unique=True, blank=True)
    description = models.TextField(blank=True, null=True)
    icon = models.CharField(max_length=100, blank=True, null=True)
    image = models.ImageField(upload_to='categories/', blank=True, null=True)
    parent = models.ForeignKey('self', on_delete=models.CASCADE, null=True, blank=True, related_name='subcategories')
    order = models.IntegerField(default=0)
    created_at = models.DateTimeField(auto_now_add=True)
    
    class Meta:
        verbose_name_plural = 'Categories'
        ordering = ['order', 'name']
    
    def save(self, *args, **kwargs):
        if not self.slug:
            self.slug = slugify(self.name)
        super().save(*args, **kwargs)
    
    def __str__(self):
        return self.name


class Brand(models.Model):
    """Product brand model."""
    name = models.CharField(max_length=200, unique=True)
    slug = models.SlugField(max_length=200, unique=True, blank=True)
    logo = models.ImageField(upload_to='brands/', blank=True, null=True)
    image = models.ImageField(upload_to='brands/', blank=True, null=True)
    color = models.CharField(max_length=7, blank=True, null=True, help_text='Hex color code')
    description = models.TextField(blank=True, null=True)
    discount = models.DecimalField(max_digits=5, decimal_places=2, default=0, validators=[MinValueValidator(0), MaxValueValidator(100)])
    created_at = models.DateTimeField(auto_now_add=True)
    
    class Meta:
        ordering = ['name']
    
    def save(self, *args, **kwargs):
        if not self.slug:
            self.slug = slugify(self.name)
        super().save(*args, **kwargs)
    
    def __str__(self):
        return self.name


class Product(models.Model):
    """Base product model."""
    name = models.CharField(max_length=300)
    slug = models.SlugField(max_length=300, unique=True, blank=True)
    description = models.TextField(blank=True, null=True)
    
    # Relationships
    category = models.ForeignKey(Category, on_delete=models.PROTECT, related_name='products')
    brand = models.ForeignKey(Brand, on_delete=models.PROTECT, related_name='products', null=True, blank=True)
    subcategory = models.CharField(max_length=200, blank=True, null=True, help_text='Product subcategory within main category')
    
    # Product identifiers
    part_number = models.CharField(max_length=100, blank=True, null=True, db_index=True, help_text='Manufacturer part number / Model number')
    sku = models.CharField(max_length=100, unique=True, blank=True, null=True, db_index=True)
    
    # Pricing (base price - variants can override)
    price = models.DecimalField(max_digits=10, decimal_places=2, validators=[MinValueValidator(0)])
    original_price = models.DecimalField(max_digits=10, decimal_places=2, validators=[MinValueValidator(0)], null=True, blank=True)
    
    # Availability status
    AVAILABILITY_CHOICES = [
        ('in_stock', 'Ex-Stock'),
        ('check_availability', 'Check Availability'),
        ('expecting', 'Expecting'),
        ('special_offer', 'Special Offer'),
        ('clearance', 'Clearance Price'),
        ('out_of_stock', 'Out of Stock'),
    ]
    availability = models.CharField(max_length=30, choices=AVAILABILITY_CHOICES, default='in_stock', db_index=True)
    
    # Flags
    hot = models.BooleanField(default=False)
    featured = models.BooleanField(default=False)
    
    # Ratings (calculated from reviews)
    rating = models.DecimalField(max_digits=3, decimal_places=2, default=0, validators=[MinValueValidator(0), MaxValueValidator(5)])
    rating_count = models.IntegerField(default=0)
    
    # Primary image
    image = models.ImageField(upload_to='products/', blank=True, null=True)
    image_url = models.URLField(blank=True, null=True, help_text='External image URL')
    
    # Additional fields
    tags = models.JSONField(default=list, blank=True, help_text='List of tag strings')
    condition = models.CharField(max_length=50, default='new', choices=[
        ('new', 'New'),
        ('refurbished', 'Refurbished'),
        ('used', 'Used'),
    ])
    
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    
    class Meta:
        ordering = ['-created_at']
        indexes = [
            models.Index(fields=['slug']),
            models.Index(fields=['category']),
            models.Index(fields=['brand']),
            models.Index(fields=['hot', 'featured']),
            models.Index(fields=['availability']),
            models.Index(fields=['part_number']),
            models.Index(fields=['subcategory']),
        ]
    
    def save(self, *args, **kwargs):
        if not self.slug:
            self.slug = slugify(self.name)
        super().save(*args, **kwargs)
    
    @property
    def discount_percentage(self):
        """Calculate discount percentage."""
        if self.original_price and self.original_price > self.price:
            return round(((self.original_price - self.price) / self.original_price) * 100, 2)
        return 0
    
    def __str__(self):
        return self.name


class ProductVariant(models.Model):
    """Product variant model (RAM, Storage, Color combinations)."""
    product = models.ForeignKey(Product, on_delete=models.CASCADE, related_name='variants')
    
    # Variant attributes
    ram = models.CharField(max_length=50, blank=True, null=True, help_text='e.g., 8GB, 16GB')
    storage = models.CharField(max_length=50, blank=True, null=True, help_text='e.g., 256GB SSD, 512GB SSD')
    color = models.CharField(max_length=50, blank=True, null=True, help_text='e.g., Black, Silver, Space Gray')
    
    # Variant-specific pricing (overrides product base price if set)
    price = models.DecimalField(max_digits=10, decimal_places=2, null=True, blank=True, validators=[MinValueValidator(0)])
    original_price = models.DecimalField(max_digits=10, decimal_places=2, null=True, blank=True, validators=[MinValueValidator(0)])
    
    # Stock tracking
    sku = models.CharField(max_length=100, unique=True)
    stock_quantity = models.IntegerField(default=0, validators=[MinValueValidator(0)])
    
    # Variant image
    image = models.ImageField(upload_to='products/variants/', blank=True, null=True)
    image_url = models.URLField(blank=True, null=True)
    
    is_active = models.BooleanField(default=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    
    class Meta:
        unique_together = [['product', 'ram', 'storage', 'color']]
        indexes = [
            models.Index(fields=['sku']),
            models.Index(fields=['product', 'is_active']),
        ]
    
    @property
    def effective_price(self):
        """Get effective price (variant price or product base price)."""
        return self.price if self.price is not None else self.product.price
    
    @property
    def effective_original_price(self):
        """Get effective original price."""
        if self.original_price is not None:
            return self.original_price
        return self.product.original_price if self.product.original_price else None
    
    def __str__(self):
        attrs = [self.ram, self.storage, self.color]
        attrs = [a for a in attrs if a]
        variant_str = ' - '.join(attrs) if attrs else 'Default'
        return f"{self.product.name} ({variant_str})"


class ProductImage(models.Model):
    """Additional product images."""
    product = models.ForeignKey(Product, on_delete=models.CASCADE, related_name='product_images')
    image = models.ImageField(upload_to='products/gallery/')
    image_url = models.URLField(blank=True, null=True)
    alt_text = models.CharField(max_length=200, blank=True, null=True)
    order = models.IntegerField(default=0)
    created_at = models.DateTimeField(auto_now_add=True)
    
    class Meta:
        ordering = ['order', 'created_at']
    
    def __str__(self):
        return f"{self.product.name} - Image {self.order}"


class ProductSpecification(models.Model):
    """Product specifications (processor, RAM, storage, etc.)."""
    product = models.OneToOneField(Product, on_delete=models.CASCADE, related_name='specifications')
    
    # Laptop specifications
    processor = models.CharField(max_length=200, blank=True, null=True)
    ram = models.CharField(max_length=50, blank=True, null=True)
    storage = models.CharField(max_length=100, blank=True, null=True)
    screen = models.CharField(max_length=100, blank=True, null=True)
    os = models.CharField(max_length=100, blank=True, null=True)
    generation = models.CharField(max_length=50, blank=True, null=True)
    
    # Printer/Scanner specifications
    printer_type = models.CharField(max_length=50, blank=True, null=True, help_text='ink-jet, laser, scanner, etc.')
    
    # General features
    features = models.JSONField(default=list, blank=True, help_text='List of feature strings')
    
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    
    def __str__(self):
        return f"Specs for {self.product.name}"

