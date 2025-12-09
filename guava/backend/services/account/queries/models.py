"""
Account models for queries (read side of CQRS).
Same models as commands for now, but can be optimized for read operations.
"""
import sys
from pathlib import Path

BASE_DIR = Path(__file__).resolve().parent.parent.parent.parent.parent
sys.path.insert(0, str(BASE_DIR / 'backend' / 'shared'))

# Import from commands for now (can be optimized later with read models)
from commands.models import User, Admin, Address, VerificationCode, PasswordResetToken, UserSession

__all__ = ['User', 'Admin', 'Address', 'VerificationCode', 'PasswordResetToken', 'UserSession']

