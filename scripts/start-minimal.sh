#!/bin/bash

echo "🚀 Starting Praxis Network (Minimal Mode)"
echo "========================================"

# Change to project directory
cd "$(dirname "$0")/.." || exit 1

# Kill any existing processes
echo "🧹 Cleaning up..."
./scripts/stop-dev.sh >/dev/null 2>&1

# Clear logs
> logs/api.log
> logs/web.log

# Start only the web server first
echo ""
echo "🌐 Starting web server..."
cd packages/web

# Create minimal env if needed
if [ ! -f ".env.local" ]; then
    echo "NEXT_PUBLIC_API_URL=http://localhost:3001" > .env.local
fi

# Start web server
pnpm dev > ../../logs/web.log 2>&1 &
WEB_PID=$!
echo $WEB_PID > ../../.dev-pids
echo "   Web server PID: $WEB_PID"

# Wait a bit
sleep 5

# Check if it's running
if curl -s http://localhost:3000 >/dev/null 2>&1; then
    echo "✅ Web server is running at http://localhost:3000"
else
    echo "❌ Web server failed to start"
    echo "📋 Last lines of web log:"
    tail -20 ../../logs/web.log
fi

echo ""
echo "========================================"
echo "📍 Proving Ground URL: http://localhost:3000/proving-ground/1"
echo "📍 Demo URL: http://localhost:3000/proving-ground/1/demo"
echo ""
echo "⚠️  Note: API server not started (database connection issues)"
echo "   The demo will show the UI but API calls won't work"
echo ""
echo "💡 To stop: ./scripts/stop-dev.sh"
echo "========================================"