#!/bin/bash

# start.sh
echo "Starting development servers..."

# Run all services
concurrently \
  "cd frontend && npm run dev" \
  "cd backend && npm start" \
  "sleep 5 && node vercel-dev.js"