"""
Event publishers for Products service.
"""
import sys
from pathlib import Path

BASE_DIR = Path(__file__).resolve().parent.parent.parent.parent.parent
sys.path.insert(0, str(BASE_DIR / 'backend' / 'shared'))

from shared.messaging.publisher import ProductEventPublisher

__all__ = ['ProductEventPublisher']


