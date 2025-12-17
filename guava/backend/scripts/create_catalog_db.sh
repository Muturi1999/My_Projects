#!/bin/bash
# Script to create catalog_db database
# Run this with a PostgreSQL superuser account

echo "Creating catalog_db database..."

# Option 1: Using postgres user (requires sudo)
if command -v sudo &> /dev/null; then
    echo "Attempting to create database using postgres user..."
    sudo -u postgres psql -c "CREATE DATABASE catalog_db;" 2>/dev/null
    if [ $? -eq 0 ]; then
        sudo -u postgres psql -c "GRANT ALL PRIVILEGES ON DATABASE catalog_db TO mike_admin;" 2>/dev/null
        echo "✅ Database created successfully!"
        exit 0
    fi
fi

# Option 2: Manual instructions
echo ""
echo "If the above didn't work, please run these commands manually:"
echo ""
echo "  psql -U postgres -c \"CREATE DATABASE catalog_db;\""
echo "  psql -U postgres -c \"GRANT ALL PRIVILEGES ON DATABASE catalog_db TO mike_admin;\""
echo ""
echo "Or if you have a different admin user:"
echo "  psql -U your_admin_user -d postgres -c \"CREATE DATABASE catalog_db;\""
echo "  psql -U your_admin_user -d postgres -c \"GRANT ALL PRIVILEGES ON DATABASE catalog_db TO mike_admin;\""
echo ""

