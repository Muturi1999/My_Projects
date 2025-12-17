#!/bin/bash
# Script to create the cms_db database and grant permissions

DB_NAME="cms_db"
DB_USER="mike_admin"
POSTGRES_USER="postgres"

echo "Creating ${DB_NAME} database..."

# Try to create database using the postgres user directly
psql -U ${POSTGRES_USER} -c "CREATE DATABASE ${DB_NAME};" 2>/dev/null
if [ $? -ne 0 ]; then
    echo "Database might already exist or need manual creation"
fi

psql -U ${POSTGRES_USER} -c "GRANT ALL PRIVILEGES ON DATABASE ${DB_NAME} TO ${DB_USER};" 2>/dev/null
if [ $? -ne 0 ]; then
    echo "Grant might have failed or already exists"
fi

if psql -U ${DB_USER} -lqt | cut -d \| -f 1 | grep -wq ${DB_NAME}; then
    echo "✅ Database '${DB_NAME}' created and permissions granted to '${DB_USER}'."
else
    echo ""
    echo "If the above didn't work, please run these commands manually:"
    echo ""
    echo "  psql -U postgres -c \"CREATE DATABASE ${DB_NAME};\""
    echo "  psql -U postgres -c \"GRANT ALL PRIVILEGES ON DATABASE ${DB_NAME} TO ${DB_USER};\""
    echo ""
    echo "Or if you have a different admin user:"
    echo "  psql -U your_admin_user -d postgres -c \"CREATE DATABASE ${DB_NAME};\""
    echo "  psql -U your_admin_user -d postgres -c \"GRANT ALL PRIVILEGES ON DATABASE ${DB_NAME} TO ${DB_USER};\""
    echo ""
fi

