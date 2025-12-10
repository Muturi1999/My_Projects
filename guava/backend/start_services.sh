#!/bin/bash
# Quick start script for backend services
# This script starts the API Gateway and Catalog service

echo "🚀 Starting Backend Services..."
echo ""

# Check if docker-compose services are running
echo "📦 Checking infrastructure services..."
if ! docker-compose ps | grep -q "Up"; then
    echo "⚠️  Starting Docker services..."
    docker-compose up -d
    echo "⏳ Waiting for services to be ready..."
    sleep 10
else
    echo "✅ Docker services are running"
fi

# Start API Gateway
echo ""
echo "🌐 Starting API Gateway on port 8000..."
cd api_gateway
python3 manage.py runserver 8000 > /tmp/api_gateway.log 2>&1 &
API_GATEWAY_PID=$!
echo "   API Gateway started (PID: $API_GATEWAY_PID)"
cd ..

# Wait a bit for API Gateway to start
sleep 3

# Start Catalog Service
echo ""
echo "📁 Starting Catalog Service on port 8002..."
cd services/catalog

# Run migrations first
echo "   Running migrations..."
python3 manage.py migrate --noinput > /dev/null 2>&1

# Start the service
python3 manage.py runserver 8002 > /tmp/catalog_service.log 2>&1 &
CATALOG_PID=$!
echo "   Catalog Service started (PID: $CATALOG_PID)"
cd ../..

# Wait for services to be ready
echo ""
echo "⏳ Waiting for services to be ready..."
sleep 5

# Test services
echo ""
echo "🧪 Testing services..."
API_GATEWAY_STATUS=$(curl -s -o /dev/null -w '%{http_code}' http://localhost:8000/api/v1/ 2>/dev/null)
CATALOG_STATUS=$(curl -s -o /dev/null -w '%{http_code}' http://localhost:8002/catalog/queries/categories/ 2>/dev/null)

if [ "$API_GATEWAY_STATUS" != "000" ]; then
    echo "✅ API Gateway is responding (HTTP $API_GATEWAY_STATUS)"
else
    echo "❌ API Gateway is not responding"
fi

if [ "$CATALOG_STATUS" != "000" ]; then
    echo "✅ Catalog Service is responding (HTTP $CATALOG_STATUS)"
else
    echo "❌ Catalog Service is not responding"
    echo "   Check logs: tail -f /tmp/catalog_service.log"
fi

echo ""
echo "📝 Service PIDs:"
echo "   API Gateway: $API_GATEWAY_PID"
echo "   Catalog Service: $CATALOG_PID"
echo ""
echo "📋 To stop services:"
echo "   kill $API_GATEWAY_PID $CATALOG_PID"
echo ""
echo "📋 To view logs:"
echo "   tail -f /tmp/api_gateway.log"
echo "   tail -f /tmp/catalog_service.log"
echo ""
echo "✅ Services started! Frontend should now be able to connect."

