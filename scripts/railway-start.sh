#!/bin/bash
set -e

echo "🔄 Running database migrations..."
pnpm --filter @workspace/db run push-force

echo "🚀 Starting server..."
pnpm --filter @workspace/api-server run start
