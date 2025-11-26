"""
Django management command to start event listener for inventory service.
"""
import sys
from pathlib import Path
from django.core.management.base import BaseCommand
import logging

BASE_DIR = Path(__file__).resolve().parent.parent.parent.parent.parent.parent
sys.path.insert(0, str(BASE_DIR / 'backend' / 'shared'))

from commands.event_handlers import start_event_listener

logger = logging.getLogger(__name__)


class Command(BaseCommand):
    help = 'Start RabbitMQ event listener for inventory service'

    def handle(self, *args, **options):
        self.stdout.write(self.style.SUCCESS('Starting inventory event listener...'))
        try:
            start_event_listener()
        except KeyboardInterrupt:
            self.stdout.write(self.style.WARNING('\nStopping event listener...'))
        except Exception as e:
            self.stdout.write(self.style.ERROR(f'Error: {e}'))
            logger.error(f"Event listener error: {e}", exc_info=True)

