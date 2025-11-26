"""
API Gateway routing to microservices.
"""
from django.urls import path, re_path
from django.conf import settings
from django.http import JsonResponse, HttpRequest
from django.views.decorators.http import require_http_methods
from django.views.decorators.csrf import csrf_exempt
import requests
import json
import logging

DEBUG = getattr(settings, 'DEBUG', False)

logger = logging.getLogger(__name__)


def proxy_request(service_name: str, path: str, request: HttpRequest):
    """
    Proxy request to a microservice.
    
    Args:
        service_name: Name of the service (products, catalog, cms, etc.)
        path: Path to forward (without /api/v1/)
        request: Django request object
    
    Returns:
        Response from microservice
    """
    service_url = settings.SERVICE_URLS.get(service_name)
    if not service_url:
        return JsonResponse({'error': f'Service {service_name} not found'}, status=404)
    
    # Construct full URL
    url = f"{service_url}/api/v1/{path}"
    
    # Get request body if present
    body = None
    if request.body:
        try:
            body = json.loads(request.body)
        except json.JSONDecodeError:
            body = request.body
    
    # Prepare headers
    headers = {
        'Content-Type': 'application/json',
    }
    
    # Forward request
    try:
        if request.method == 'GET':
            response = requests.get(url, params=request.GET, headers=headers, timeout=10)
        elif request.method == 'POST':
            response = requests.post(url, json=body, headers=headers, timeout=10)
        elif request.method == 'PUT':
            response = requests.put(url, json=body, headers=headers, timeout=10)
        elif request.method == 'PATCH':
            response = requests.patch(url, json=body, headers=headers, timeout=10)
        elif request.method == 'DELETE':
            response = requests.delete(url, headers=headers, timeout=10)
        else:
            return JsonResponse({'error': 'Method not allowed'}, status=405)
        
        # Return response
        try:
            data = response.json()
        except ValueError:
            data = {'data': response.text}
        
        return JsonResponse(data, status=response.status_code, safe=False)
    
    except requests.exceptions.ConnectionError as e:
        logger.error(f"Connection error to {service_name}: {e}")
        return JsonResponse(
            {
                'error': f'Service {service_name} unavailable',
                'message': f'Could not connect to {service_name} service. Make sure it is running.',
                'service_url': service_url
            },
            status=503
        )
    except requests.exceptions.Timeout as e:
        logger.error(f"Timeout connecting to {service_name}: {e}")
        return JsonResponse(
            {
                'error': f'Service {service_name} timeout',
                'message': f'Request to {service_name} service timed out.'
            },
            status=504
        )
    except requests.exceptions.RequestException as e:
        logger.error(f"Error proxying to {service_name}: {e}", exc_info=True)
        return JsonResponse(
            {
                'error': f'Service {service_name} error',
                'message': str(e)
            },
            status=503
        )
    except Exception as e:
        logger.error(f"Unexpected error in proxy_request: {e}", exc_info=True)
        return JsonResponse(
            {
                'error': 'Internal server error',
                'message': str(e) if DEBUG else 'An unexpected error occurred'
            },
            status=500
        )


@csrf_exempt
@require_http_methods(["GET", "POST", "PUT", "PATCH", "DELETE"])
def products_proxy(request, path=''):
    """Proxy requests to Products service"""
    return proxy_request('products', f'products/{path}', request)


@csrf_exempt
@require_http_methods(["GET", "POST", "PUT", "PATCH", "DELETE"])
def catalog_proxy(request, path=''):
    """Proxy requests to Catalog service"""
    return proxy_request('catalog', f'catalog/{path}', request)


@csrf_exempt
@require_http_methods(["GET", "POST", "PUT", "PATCH", "DELETE"])
def cms_proxy(request, path=''):
    """Proxy requests to CMS service"""
    return proxy_request('cms', f'cms/{path}', request)


@csrf_exempt
@require_http_methods(["GET", "POST", "PUT", "PATCH", "DELETE"])
def orders_proxy(request, path=''):
    """Proxy requests to Orders service"""
    return proxy_request('orders', f'orders/{path}', request)


@csrf_exempt
@require_http_methods(["GET", "POST", "PUT", "PATCH", "DELETE"])
def inventory_proxy(request, path=''):
    """Proxy requests to Inventory service"""
    return proxy_request('inventory', f'inventory/{path}', request)


@csrf_exempt
@require_http_methods(["GET", "POST", "PUT", "PATCH", "DELETE"])
def promotions_proxy(request, path=''):
    """Proxy requests to Promotions service"""
    return proxy_request('promotions', f'promotions/{path}', request)


@csrf_exempt
@require_http_methods(["GET", "POST", "PUT", "PATCH", "DELETE"])
def reports_proxy(request, path=''):
    """Proxy requests to Reports service"""
    return proxy_request('reports', f'reports/{path}', request)


# URL patterns
urlpatterns = [
    re_path(r'^products/?(?P<path>.*)$', products_proxy, name='products-proxy'),
    re_path(r'^catalog/?(?P<path>.*)$', catalog_proxy, name='catalog-proxy'),
    re_path(r'^cms/?(?P<path>.*)$', cms_proxy, name='cms-proxy'),
    re_path(r'^orders/?(?P<path>.*)$', orders_proxy, name='orders-proxy'),
    re_path(r'^inventory/?(?P<path>.*)$', inventory_proxy, name='inventory-proxy'),
    re_path(r'^promotions/?(?P<path>.*)$', promotions_proxy, name='promotions-proxy'),
    re_path(r'^reports/?(?P<path>.*)$', reports_proxy, name='reports-proxy'),
]
