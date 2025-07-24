from django.db import models
from accounts.models import CustomUser
from books.models import Book
from django.utils.timezone import now

class History(models.Model):
    user = models.ForeignKey(CustomUser, on_delete=models.CASCADE)
    book = models.ForeignKey(Book, on_delete=models.CASCADE)
    viewed_at = models.DateTimeField(default=now)
