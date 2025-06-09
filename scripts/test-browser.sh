#!/bin/bash

# Browser Testing Script
# This script starts servers and opens mcp-browser for testing

echo "🧪 Starting Praxis Network Test Environment..."

# Start servers first
SCRIPT_DIR="$( cd "$( dirname "${BASH_SOURCE[0]}" )" && pwd )"
"$SCRIPT_DIR/start-dev.sh" &

# Wait for servers to be ready
echo "⏳ Waiting for servers to start..."
sleep 10

# Open browser for testing
echo "🌐 Opening test browser..."
echo ""
echo "📍 Test URLs:"
echo "   - User Registration: http://localhost:3000/auth/register"
echo "   - User Login:        http://localhost:3000/login"
echo "   - Admin Login:       http://localhost:3000/admin-login"
echo "   - User Dashboard:    http://localhost:3000/dashboard (after login)"
echo "   - Admin Dashboard:   http://localhost:3000/admin/dashboard (after admin login)"
echo ""
echo "🔍 Testing Focus: Conversation Persistence"
echo "   1. Register new user"
echo "   2. Complete handle selection"
echo "   3. Start onboarding interview"
echo "   4. Send a few messages"
echo "   5. Refresh the page - conversation should persist"
echo "   6. Complete the interview"
echo "   7. Check admin dashboard for conversation review"
echo ""

# You can add mcp-browser command here if it's available as CLI
# For now, we'll just keep the servers running
echo "💡 Servers are running. Open your browser to test."
echo "   Press Ctrl+C to stop servers when done."

# Keep script running
wait