# Testing Guide

## Running Tests

### Individual Service Tests

```bash
# Products service
cd backend/services/products
python manage.py test

# Catalog service
cd backend/services/catalog
python manage.py test

# Run specific test file
python manage.py test commands.tests.test_models

# Run specific test
python manage.py test commands.tests.test_models.ProductModelTest
```

### All Services Tests

```bash
# From project root
for service in products catalog cms orders inventory promotions reports; do
  echo "Testing $service..."
  cd backend/services/$service
  python manage.py test
  cd ../../..
done
```

## Test Structure

Each service follows this structure:

```
service/
├── commands/
│   └── tests/
│       ├── __init__.py
│       ├── test_models.py
│       ├── test_serializers.py
│       └── test_views.py
└── queries/
    └── tests/
        ├── __init__.py
        ├── test_serializers.py
        └── test_views.py
```

## Writing Tests

### Model Tests

```python
from django.test import TestCase
from commands.models import Product

class ProductModelTest(TestCase):
    def setUp(self):
        self.product = Product.objects.create(...)
    
    def test_product_creation(self):
        self.assertEqual(self.product.name, "Test")
```

### View Tests

```python
from rest_framework.test import APIClient
from rest_framework import status

class ProductViewTest(TestCase):
    def setUp(self):
        self.client = APIClient()
    
    def test_list_products(self):
        response = self.client.get('/api/v1/products/queries/')
        self.assertEqual(response.status_code, status.HTTP_200_OK)
```

### API Integration Tests

```python
import requests

def test_api_gateway_routing():
    response = requests.get('http://localhost:8000/api/v1/products/queries/')
    assert response.status_code == 200
```

## Test Coverage

To check test coverage:

```bash
pip install coverage
coverage run --source='.' manage.py test
coverage report
coverage html  # Generate HTML report
```

## Continuous Integration

Example GitHub Actions workflow:

```yaml
name: Tests
on: [push, pull_request]
jobs:
  test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v2
      - uses: actions/setup-python@v2
      - run: pip install -r requirements.txt
      - run: python manage.py test
```

## Next Steps

- [ ] Add more comprehensive test coverage
- [ ] Add integration tests
- [ ] Add API endpoint tests
- [ ] Add event consumer tests
- [ ] Set up CI/CD pipeline

