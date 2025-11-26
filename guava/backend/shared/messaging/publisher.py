"""
RabbitMQ event publisher for publishing domain events.
"""
import json
import logging
from typing import Any, Dict
import pika
from pika.exceptions import AMQPConnectionError
from ..config.env import get_rabbitmq_config

logger = logging.getLogger(__name__)


class EventPublisher:
    """
    Base class for publishing events to RabbitMQ.
    """
    
    def __init__(self):
        self.config = get_rabbitmq_config()
        self.connection = None
        self.channel = None
    
    def connect(self):
        """Establish connection to RabbitMQ"""
        try:
            parameters = pika.URLParameters(self.config.url)
            self.connection = pika.BlockingConnection(parameters)
            self.channel = self.connection.channel()
            logger.info("Connected to RabbitMQ")
        except AMQPConnectionError as e:
            logger.error(f"Failed to connect to RabbitMQ: {e}")
            raise
    
    def close(self):
        """Close RabbitMQ connection"""
        if self.connection and not self.connection.is_closed:
            self.connection.close()
            logger.info("Disconnected from RabbitMQ")
    
    def declare_exchange(self, exchange_name: str, exchange_type: str = 'topic'):
        """
        Declare an exchange.
        
        Args:
            exchange_name: Name of the exchange
            exchange_type: Type of exchange (topic, direct, fanout)
        """
        if not self.channel:
            self.connect()
        
        self.channel.exchange_declare(
            exchange=exchange_name,
            exchange_type=exchange_type,
            durable=True
        )
        logger.debug(f"Declared exchange: {exchange_name}")
    
    def publish(self, exchange: str, routing_key: str, message: Dict[str, Any]):
        """
        Publish an event to RabbitMQ.
        
        Args:
            exchange: Exchange name
            routing_key: Routing key (e.g., 'product.created')
            message: Message payload as dictionary
        """
        if not self.channel:
            self.connect()
        
        # Declare exchange if not already declared
        self.declare_exchange(exchange)
        
        try:
            self.channel.basic_publish(
                exchange=exchange,
                routing_key=routing_key,
                body=json.dumps(message),
                properties=pika.BasicProperties(
                    delivery_mode=2,  # Make message persistent
                    content_type='application/json'
                )
            )
            logger.info(f"Published event: {routing_key} to {exchange}")
        except Exception as e:
            logger.error(f"Failed to publish event {routing_key}: {e}")
            raise
    
    def __enter__(self):
        """Context manager entry"""
        self.connect()
        return self
    
    def __exit__(self, exc_type, exc_val, exc_tb):
        """Context manager exit"""
        self.close()


class ProductEventPublisher(EventPublisher):
    """Publisher for product-related events"""
    
    EXCHANGE = 'product_events'
    
    def product_created(self, product_id: str, product_data: Dict[str, Any]):
        """Publish product created event"""
        message = {
            'event_type': 'product.created',
            'product_id': product_id,
            'data': product_data,
            'timestamp': datetime.utcnow().isoformat()
        }
        self.publish(self.EXCHANGE, 'product.created', message)
    
    def product_updated(self, product_id: str, product_data: Dict[str, Any]):
        """Publish product updated event"""
        message = {
            'event_type': 'product.updated',
            'product_id': product_id,
            'data': product_data,
            'timestamp': datetime.utcnow().isoformat()
        }
        self.publish(self.EXCHANGE, 'product.updated', message)
    
    def product_deleted(self, product_id: str):
        """Publish product deleted event"""
        message = {
            'event_type': 'product.deleted',
            'product_id': product_id,
            'timestamp': datetime.utcnow().isoformat()
        }
        self.publish(self.EXCHANGE, 'product.deleted', message)


class OrderEventPublisher(EventPublisher):
    """Publisher for order-related events"""
    
    EXCHANGE = 'order_events'
    
    def order_created(self, order_id: str, order_data: Dict[str, Any]):
        """Publish order created event"""
        message = {
            'event_type': 'order.created',
            'order_id': order_id,
            'data': order_data,
            'timestamp': datetime.utcnow().isoformat()
        }
        self.publish(self.EXCHANGE, 'order.created', message)
    
    def order_status_changed(self, order_id: str, old_status: str, new_status: str):
        """Publish order status changed event"""
        message = {
            'event_type': 'order.status_changed',
            'order_id': order_id,
            'old_status': old_status,
            'new_status': new_status,
            'timestamp': datetime.utcnow().isoformat()
        }
        self.publish(self.EXCHANGE, 'order.status_changed', message)


class InventoryEventPublisher(EventPublisher):
    """Publisher for inventory-related events"""
    
    EXCHANGE = 'inventory_events'
    
    def stock_updated(self, product_id: str, quantity: int, warehouse_id: str = None):
        """Publish stock updated event"""
        message = {
            'event_type': 'stock.updated',
            'product_id': product_id,
            'quantity': quantity,
            'warehouse_id': warehouse_id,
            'timestamp': datetime.utcnow().isoformat()
        }
        self.publish(self.EXCHANGE, 'stock.updated', message)
    
    def stock_low(self, product_id: str, current_stock: int, threshold: int):
        """Publish stock low alert event"""
        message = {
            'event_type': 'stock.low',
            'product_id': product_id,
            'current_stock': current_stock,
            'threshold': threshold,
            'timestamp': datetime.utcnow().isoformat()
        }
        self.publish(self.EXCHANGE, 'stock.low', message)

