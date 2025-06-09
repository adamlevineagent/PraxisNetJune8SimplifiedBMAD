#!/bin/bash

echo "🔍 Praxis Network Development Environment - Debug Mode"
echo "====================================================="

# Function to check if a command exists
command_exists() {
    command -v "$1" >/dev/null 2>&1
}

# Check prerequisites
echo "📋 Checking prerequisites..."

if ! command_exists node; then
    echo "❌ Node.js is not installed"
    exit 1
fi

if ! command_exists pnpm; then
    echo "❌ PNPM is not installed"
    exit 1
fi

echo "✅ Node version: $(node --version)"
echo "✅ PNPM version: $(pnpm --version)"

# Change to project directory
cd "$(dirname "$0")/.." || exit 1
echo "📂 Working directory: $(pwd)"

# Check if node_modules exist
if [ ! -d "node_modules" ]; then
    echo "📦 Installing dependencies..."
    pnpm install
fi

# Kill any existing processes on our ports
echo "🧹 Cleaning up existing processes..."
lsof -ti:3000 | xargs kill -9 2>/dev/null || true
lsof -ti:3001 | xargs kill -9 2>/dev/null || true

# Clear PID file
> .dev-pids

# Create logs directory
mkdir -p logs

# Start API server
echo ""
echo "🚀 Starting API server..."
cd packages/api

# Check if .env exists
if [ ! -f ".env" ]; then
    echo "⚠️  No .env file found in packages/api"
    echo "   Creating from .env.example..."
    if [ -f ".env.example" ]; then
        cp .env.example .env
        echo "   ✅ Created .env file - please update with your credentials"
    else
        echo "   ❌ No .env.example found!"
    fi
fi

# Build the API first
echo "🔨 Building API..."
pnpm build

# Start API in development mode
echo "▶️  Starting API server on port 3001..."
nohup pnpm dev > ../../logs/api-debug.log 2>&1 &
API_PID=$!
echo $API_PID >> ../../.dev-pids
echo "   PID: $API_PID"

# Wait for API to start
echo "⏳ Waiting for API server to start..."
for i in {1..30}; do
    if curl -s http://localhost:3001/api/health >/dev/null 2>&1; then
        echo "✅ API server is running!"
        break
    fi
    if [ $i -eq 30 ]; then
        echo "❌ API server failed to start after 30 seconds"
        echo "📋 Last 20 lines of API log:"
        tail -20 ../../logs/api-debug.log
        exit 1
    fi
    sleep 1
    echo -n "."
done
echo ""

# Start Web server
cd ../web
echo ""
echo "🌐 Starting web server..."

# Check if .env.local exists
if [ ! -f ".env.local" ]; then
    echo "⚠️  No .env.local file found in packages/web"
    echo "   Creating with defaults..."
    echo "NEXT_PUBLIC_API_URL=http://localhost:3001" > .env.local
    echo "NEXT_PUBLIC_WS_URL=http://localhost:3001" >> .env.local
    echo "   ✅ Created .env.local file"
fi

# Start web in development mode
echo "▶️  Starting web server on port 3000..."
nohup pnpm dev > ../../logs/web-debug.log 2>&1 &
WEB_PID=$!
echo $WEB_PID >> ../../.dev-pids
echo "   PID: $WEB_PID"

# Wait for web to start
echo "⏳ Waiting for web server to start..."
for i in {1..30}; do
    if curl -s http://localhost:3000 >/dev/null 2>&1; then
        echo "✅ Web server is running!"
        break
    fi
    if [ $i -eq 30 ]; then
        echo "❌ Web server failed to start after 30 seconds"
        echo "📋 Last 20 lines of Web log:"
        tail -20 ../../logs/web-debug.log
        exit 1
    fi
    sleep 1
    echo -n "."
done

cd ../..

echo ""
echo "====================================================="
echo "✅ Development servers started successfully!"
echo ""
echo "📍 Services running at:"
echo "   - Frontend: http://localhost:3000"
echo "   - API:      http://localhost:3001"
echo "   - API Docs: http://localhost:3001/api/docs"
echo "   - Health:   http://localhost:3001/api/health"
echo ""
echo "📄 Debug logs available at:"
echo "   - API: ./logs/api-debug.log"
echo "   - Web: ./logs/web-debug.log"
echo ""
echo "🧪 Quick tests:"
echo "   - API Health: curl http://localhost:3001/api/health"
echo "   - Web Home:   curl -I http://localhost:3000"
echo ""
echo "💡 Run ./scripts/stop-dev.sh to stop all servers"
echo "====================================================="

# Keep script running and show logs
echo ""
echo "📊 Showing combined logs (Ctrl+C to exit)..."
echo ""
tail -f logs/api-debug.log logs/web-debug.log