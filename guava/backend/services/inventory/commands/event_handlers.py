"""
Event handlers for inventory service.
Listens to product events from message queue.
"""
import sys
from pathlib import Path
import logging

BASE_DIR = Path(__file__).resolve().parent.parent.parent.parent.parent
sys.path.insert(0, str(BASE_DIR / 'backend' / 'shared'))

from shared.messaging.consumer import ProductEventConsumer
from .models import Stock, Warehouse

logger = logging.getLogger(__name__)


def handle_product_created(message: dict):
    """Handle product created event - create initial stock"""
    product_id = message.get('product_id')
    logger.info(f"Product created: {product_id}, creating initial stock")
    
    # Get default warehouse or create one
    warehouse = Warehouse.objects.filter(is_active=True).first()
    if not warehouse:
        warehouse = Warehouse.objects.create(name='Main Warehouse', is_active=True)
    
    # Create stock entry
    Stock.objects.create(
        product_id=product_id,
        warehouse=warehouse,
        quantity=0,
        low_stock_threshold=10
    )


def handle_product_deleted(message: dict):
    """Handle product deleted event - mark stock as inactive"""
    product_id = message.get('product_id')
    logger.info(f"Product deleted: {product_id}, deactivating stock")
    
    Stock.objects.filter(product_id=product_id).update(is_active=False)


def start_event_listener():
    """Start listening to product events"""
    consumer = ProductEventConsumer()
    handlers = {
        'product.created': handle_product_created,
        'product.deleted': handle_product_deleted,
    }
    consumer.consume_product_events(handlers)


