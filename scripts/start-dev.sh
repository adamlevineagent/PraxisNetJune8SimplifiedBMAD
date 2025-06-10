#!/bin/bash

# Start Development Servers Script
# This script handles starting all development servers with proper port management

echo "🚀 Starting Praxis Network Development Environment..."

# Function to check if a port is in use
check_port() {
    lsof -i :$1 > /dev/null 2>&1
}

# Function to kill process on a specific port
kill_port() {
    if check_port $1; then
        echo "⚠️  Port $1 is in use. Stopping existing process..."
        lsof -ti:$1 | xargs kill -9 2>/dev/null || true
        sleep 1
    fi
}

# Navigate to project root
SCRIPT_DIR="$( cd "$( dirname "${BASH_SOURCE[0]}" )" && pwd )"
PROJECT_ROOT="$( cd "$SCRIPT_DIR/.." && pwd )"
cd "$PROJECT_ROOT"

# Check and clear ports
echo "📋 Checking ports..."
kill_port 3000  # Frontend default port
kill_port 3001  # API port

# Ensure logs directory exists
mkdir -p logs

# Start the API server in background
echo "🔧 Starting API server on port 3001..."
cd packages/api
pnpm dev > ../../logs/api.log 2>&1 &
API_PID=$!
cd ../..

# Wait for API to be ready
echo "⏳ Waiting for API server to start..."
sleep 5

# Start the web server in background
echo "🌐 Starting web server on port 3000..."
cd packages/web
pnpm dev > ../../logs/web.log 2>&1 &
WEB_PID=$!
cd ../..

# Save PIDs to file for shutdown script
echo "$API_PID" > .dev-pids
echo "$WEB_PID" >> .dev-pids

echo "✅ Development servers started!"
echo ""
echo "📍 Services running at:"
echo "   - Frontend: http://localhost:3000"
echo "   - API:      http://localhost:3001"
echo "   - API Docs: http://localhost:3001/api/docs"
echo ""
echo "📄 Logs available at:"
echo "   - API: ./logs/api.log"
echo "   - Web: ./logs/web.log"
echo ""
echo "💡 Run ./scripts/stop-dev.sh to stop all servers"
echo ""
echo "📊 Watching logs (Ctrl+C to exit)..."
tail -f logs/api.log logs/web.log
