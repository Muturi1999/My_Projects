"""
RabbitMQ event consumer for consuming domain events.
"""
import json
import logging
from typing import Callable, Dict, Any
from datetime import datetime
import pika
from pika.exceptions import AMQPConnectionError
from ..config.env import get_rabbitmq_config

logger = logging.getLogger(__name__)


class EventConsumer:
    """
    Base class for consuming events from RabbitMQ.
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
        """Declare an exchange"""
        if not self.channel:
            self.connect()
        
        self.channel.exchange_declare(
            exchange=exchange_name,
            exchange_type=exchange_type,
            durable=True
        )
    
    def declare_queue(self, queue_name: str, durable: bool = True):
        """Declare a queue"""
        if not self.channel:
            self.connect()
        
        self.channel.queue_declare(queue=queue_name, durable=durable)
        logger.debug(f"Declared queue: {queue_name}")
    
    def bind_queue(self, queue_name: str, exchange: str, routing_key: str):
        """Bind queue to exchange with routing key"""
        if not self.channel:
            self.connect()
        
        self.channel.queue_bind(
            exchange=exchange,
            queue=queue_name,
            routing_key=routing_key
        )
        logger.debug(f"Bound queue {queue_name} to {exchange} with key {routing_key}")
    
    def consume(self, queue_name: str, callback: Callable[[Dict[str, Any]], None], auto_ack: bool = False):
        """
        Start consuming messages from a queue.
        
        Args:
            queue_name: Name of the queue to consume from
            callback: Function to call when message is received
            auto_ack: Whether to auto-acknowledge messages
        """
        if not self.channel:
            self.connect()
        
        def on_message(channel, method, properties, body):
            try:
                message = json.loads(body)
                logger.info(f"Received message: {method.routing_key}")
                callback(message)
                if not auto_ack:
                    channel.basic_ack(delivery_tag=method.delivery_tag)
            except Exception as e:
                logger.error(f"Error processing message: {e}")
                if not auto_ack:
                    channel.basic_nack(delivery_tag=method.delivery_tag, requeue=True)
        
        self.channel.basic_consume(
            queue=queue_name,
            on_message_callback=on_message,
            auto_ack=auto_ack
        )
        
        logger.info(f"Started consuming from queue: {queue_name}")
        self.channel.start_consuming()
    
    def __enter__(self):
        """Context manager entry"""
        self.connect()
        return self
    
    def __exit__(self, exc_type, exc_val, exc_tb):
        """Context manager exit"""
        self.close()


class ProductEventConsumer(EventConsumer):
    """Consumer for product-related events"""
    
    EXCHANGE = 'product_events'
    
    def setup(self, queue_name: str = 'product_events_queue'):
        """Setup exchange, queue, and bindings for product events"""
        self.declare_exchange(self.EXCHANGE)
        self.declare_queue(queue_name)
        # Bind to all product events
        self.bind_queue(queue_name, self.EXCHANGE, 'product.*')
    
    def consume_product_events(self, handlers: Dict[str, Callable]):
        """
        Consume product events and route to appropriate handlers.
        
        Args:
            handlers: Dictionary mapping event types to handler functions
                    e.g., {'product.created': handle_product_created}
        """
        queue_name = 'product_events_queue'
        self.setup(queue_name)
        
        def callback(message: Dict[str, Any]):
            event_type = message.get('event_type')
            handler = handlers.get(event_type)
            if handler:
                handler(message)
            else:
                logger.warning(f"No handler for event type: {event_type}")
        
        self.consume(queue_name, callback)


class OrderEventConsumer(EventConsumer):
    """Consumer for order-related events"""
    
    EXCHANGE = 'order_events'
    
    def setup(self, queue_name: str = 'order_events_queue'):
        """Setup exchange, queue, and bindings for order events"""
        self.declare_exchange(self.EXCHANGE)
        self.declare_queue(queue_name)
        self.bind_queue(queue_name, self.EXCHANGE, 'order.*')
    
    def consume_order_events(self, handlers: Dict[str, Callable]):
        """Consume order events and route to appropriate handlers"""
        queue_name = 'order_events_queue'
        self.setup(queue_name)
        
        def callback(message: Dict[str, Any]):
            event_type = message.get('event_type')
            handler = handlers.get(event_type)
            if handler:
                handler(message)
            else:
                logger.warning(f"No handler for event type: {event_type}")
        
        self.consume(queue_name, callback)


class InventoryEventConsumer(EventConsumer):
    """Consumer for inventory-related events"""
    
    EXCHANGE = 'inventory_events'
    
    def setup(self, queue_name: str = 'inventory_events_queue'):
        """Setup exchange, queue, and bindings for inventory events"""
        self.declare_exchange(self.EXCHANGE)
        self.declare_queue(queue_name)
        self.bind_queue(queue_name, self.EXCHANGE, 'stock.*')
    
    def consume_inventory_events(self, handlers: Dict[str, Callable]):
        """Consume inventory events and route to appropriate handlers"""
        queue_name = 'inventory_events_queue'
        self.setup(queue_name)
        
        def callback(message: Dict[str, Any]):
            event_type = message.get('event_type')
            handler = handlers.get(event_type)
            if handler:
                handler(message)
            else:
                logger.warning(f"No handler for event type: {event_type}")
        
        self.consume(queue_name, callback)

