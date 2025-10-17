# import os
# from dotenv import load_dotenv

# # Load .env file
# load_dotenv()

# # Fetch and clean credentials
# AT_USERNAME = os.getenv('AT_USERNAME', '').strip()
# AT_API_KEY = os.getenv('AT_API_KEY', '').strip()
# AT_SENDER_ID = os.getenv('AT_SENDER_ID', '').strip()

# # Validate credentials
# if not AT_USERNAME or not AT_API_KEY:
#     raise ValueError("❌ Missing Africa's Talking credentials. "
#                      "Please check AT_USERNAME and AT_API_KEY in your .env file.")

# print(f"✅ Loaded Africa's Talking config:\n  Username: {AT_USERNAME}\n  Sender ID: {AT_SENDER_ID or 'None'}")

# # File paths
# CONTACTS_FILE = 'test_contacts_format1.xlsx'

# # Message Template
# MESSAGE_TEMPLATE = """Dear {name},

# This is a custom message being sent to you.

# Best regards,
# The Team
# """

# # Settings
# DELAY_BETWEEN_SMS = 1  # seconds

import os
from dotenv import load_dotenv

# Load environment variables from .env
load_dotenv()

# ==========================
# AFRICA'S TALKING CREDENTIALS
# ==========================
AT_USERNAME = os.getenv('AT_USERNAME', '').strip()
AT_API_KEY = os.getenv('AT_API_KEY', '').strip()
AT_SENDER_ID = os.getenv('AT_SENDER_ID', '').strip()

# Validate credentials
if not AT_USERNAME or not AT_API_KEY:
    raise ValueError("❌ Missing Africa's Talking credentials. "
                     "Please check AT_USERNAME and AT_API_KEY in your .env file.")

print(f"✅ Loaded Africa's Talking config:\n  Username: {AT_USERNAME}\n  Sender ID: {AT_SENDER_ID or 'None'}")

# ==========================
# SMS SENDER SETTINGS
# ==========================
CONTACTS_FILE = os.getenv('CONTACTS_FILE', 'test_contacts_format1.xlsx')
DELAY_BETWEEN_SMS = int(os.getenv('DELAY_BETWEEN_SMS', 1))

# ==========================
# MESSAGE TEMPLATE
# ==========================
MESSAGE_TEMPLATE = """Dear {name},

This is a custom message being sent to you.

Best regards,
The Team
"""
