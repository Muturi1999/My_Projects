# Event Consumers Setup Guide

## Overview

Event consumers listen to RabbitMQ messages and react to events from other services. This enables event-driven architecture.

## Available Event Consumers

### Inventory Service

The inventory service listens to product events:

- `product.created` - Creates initial stock entry
- `product.deleted` - Deactivates stock

**Start the listener:**
```bash
cd backend/services/inventory
python manage.py start_event_listener
```

## How It Works

1. **Event Publisher** (in source service) publishes event to RabbitMQ
2. **Event Consumer** (in target service) listens and processes event
3. **Event Handler** performs the action (e.g., create stock, update cache)

## Adding New Event Consumers

### Step 1: Create Event Handlers

```python
# backend/services/your_service/commands/event_handlers.py
from shared.messaging.consumer import ProductEventConsumer

def handle_product_created(message: dict):
    # Your logic here
    pass

def start_event_listener():
    consumer = ProductEventConsumer()
    handlers = {
        'product.created': handle_product_created,
    }
    consumer.consume_product_events(handlers)
```

### Step 2: Create Management Command

```python
# backend/services/your_service/commands/management/commands/start_listener.py
from django.core.management.base import BaseCommand
from commands.event_handlers import start_event_listener

class Command(BaseCommand):
    help = 'Start event listener'
    
    def handle(self, *args, **options):
        start_event_listener()
```

### Step 3: Run the Listener

```bash
python manage.py start_listener
```

## Running in Production

For production, use a process manager like:
- **Supervisor**
- **systemd**
- **Docker Compose** with separate containers

Example supervisor config:
```ini
[program:inventory_listener]
command=/path/to/python manage.py start_event_listener
directory=/path/to/inventory/service
autostart=true
autorestart=true
```

## Testing Event Flow

1. **Start RabbitMQ:**
   ```bash
   docker-compose up -d rabbitmq
   ```

2. **Start event listener:**
   ```bash
   cd backend/services/inventory
   python manage.py start_event_listener
   ```

3. **Create a product** (triggers event):
   ```bash
   curl -X POST http://localhost:8001/api/v1/products/commands/ \
     -H "Content-Type: application/json" \
     -d '{"name": "Test Product", ...}'
   ```

4. **Check inventory service** - Should have created stock entry

## Event Types

### Product Events
- `product.created`
- `product.updated`
- `product.deleted`

### Order Events
- `order.created`
- `order.status_changed`

### Inventory Events
- `stock.updated`
- `stock.low`

## Troubleshooting

### Listener not receiving events
- Check RabbitMQ is running
- Verify exchange and queue names match
- Check connection credentials in .env

### Events not being processed
- Check handler function logic
- Review logs for errors
- Verify message format matches handler expectations

