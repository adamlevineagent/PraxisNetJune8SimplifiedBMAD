#!/bin/bash

# Stop Development Servers Script
# This script handles gracefully stopping all development servers

echo "🛑 Stopping Praxis Network Development Environment..."

# Navigate to project root
SCRIPT_DIR="$( cd "$( dirname "${BASH_SOURCE[0]}" )" && pwd )"
PROJECT_ROOT="$( cd "$SCRIPT_DIR/.." && pwd )"
cd "$PROJECT_ROOT"

# Function to kill process on a specific port
kill_port() {
    if lsof -i :$1 > /dev/null 2>&1; then
        echo "   Stopping process on port $1..."
        lsof -ti:$1 | xargs kill -9 2>/dev/null || true
    fi
}

# Read PIDs from file if it exists
if [ -f .dev-pids ]; then
    echo "📋 Stopping servers from PID file..."
    while IFS= read -r pid; do
        if ps -p $pid > /dev/null 2>&1; then
            echo "   Stopping process $pid..."
            kill -9 $pid 2>/dev/null || true
        fi
    done < .dev-pids
    rm .dev-pids
fi

# Also check ports directly as fallback
echo "📋 Checking ports..."
kill_port 3000  # Frontend
kill_port 3001  # API

echo "✅ All servers stopped!"