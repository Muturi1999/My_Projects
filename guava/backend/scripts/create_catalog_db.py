#!/usr/bin/env python3
"""
Script to create catalog_db database.
This script attempts to create the database using psycopg2.
"""
import psycopg2
from psycopg2.extensions import ISOLATION_LEVEL_AUTOCOMMIT
import sys

# Database connection parameters from .env
DB_CONFIG = {
    'host': 'localhost',
    'port': 5432,
    'user': 'mike_admin',
    'password': 'M!k3@muturi',
    'database': 'postgres'  # Connect to postgres to create catalog_db
}

def create_database():
    """Create catalog_db database"""
    try:
        # Connect to PostgreSQL server (to postgres database)
        print("Connecting to PostgreSQL...")
        conn = psycopg2.connect(**DB_CONFIG)
        conn.set_isolation_level(ISOLATION_LEVEL_AUTOCOMMIT)
        cursor = conn.cursor()
        
        # Check if database exists
        cursor.execute("SELECT 1 FROM pg_database WHERE datname = 'catalog_db'")
        exists = cursor.fetchone()
        
        if exists:
            print("✅ Database 'catalog_db' already exists!")
            return True
        
        # Create database
        print("Creating database 'catalog_db'...")
        cursor.execute('CREATE DATABASE catalog_db')
        print("✅ Database 'catalog_db' created successfully!")
        
        # Grant privileges
        print("Granting privileges to mike_admin...")
        cursor.execute("GRANT ALL PRIVILEGES ON DATABASE catalog_db TO mike_admin")
        print("✅ Privileges granted!")
        
        cursor.close()
        conn.close()
        return True
        
    except psycopg2.OperationalError as e:
        if "permission denied" in str(e).lower() or "permission to create database" in str(e).lower():
            print("❌ Permission denied: mike_admin doesn't have permission to create databases.")
            print("\nPlease run one of these commands as a PostgreSQL superuser:")
            print("\n  Option 1 (with sudo):")
            print("    sudo -u postgres psql -c \"CREATE DATABASE catalog_db;\"")
            print("    sudo -u postgres psql -c \"GRANT ALL PRIVILEGES ON DATABASE catalog_db TO mike_admin;\"")
            print("\n  Option 2 (if you know postgres password):")
            print("    psql -U postgres -d postgres -c \"CREATE DATABASE catalog_db;\"")
            print("    psql -U postgres -d postgres -c \"GRANT ALL PRIVILEGES ON DATABASE catalog_db TO mike_admin;\"")
            return False
        else:
            print(f"❌ Error: {e}")
            return False
    except Exception as e:
        print(f"❌ Unexpected error: {e}")
        return False

if __name__ == '__main__':
    success = create_database()
    sys.exit(0 if success else 1)

