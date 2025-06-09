#!/bin/bash

# Database Reset Script
# This script resets the database to a clean state for testing

echo "🗄️  Resetting Praxis Network Database..."

# Navigate to project root
SCRIPT_DIR="$( cd "$( dirname "${BASH_SOURCE[0]}" )" && pwd )"
PROJECT_ROOT="$( cd "$SCRIPT_DIR/.." && pwd )"
cd "$PROJECT_ROOT"

# Stop any running servers first
echo "🛑 Stopping servers..."
"$SCRIPT_DIR/stop-dev.sh"

# Navigate to API directory
cd packages/api

echo "📋 Current database status:"
npx prisma migrate status

echo ""
read -p "⚠️  This will delete all data. Continue? (y/N) " -n 1 -r
echo ""

if [[ $REPLY =~ ^[Yy]$ ]]; then
    echo "🔄 Resetting database..."
    
    # Reset database
    npx prisma migrate reset --force
    
    echo "✅ Database reset complete!"
    echo ""
    echo "💡 You may want to run seed data:"
    echo "   cd packages/api && npm run seed"
else
    echo "❌ Database reset cancelled."
fi