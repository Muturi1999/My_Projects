from django.contrib import admin
from .models import Book, Category

@admin.register(Book)
class BookAdmin(admin.ModelAdmin):
    list_display = ['title', 'author', 'price', 'stock', 'is_offer', 'is_featured']
    list_filter = ['category', 'category', 'is_featured']
    search_fields = ['title', 'author']

admin.site.register(Category)
