#!/bin/bash

# Masterson UI Launcher
# Launches the Masterson UI design application

APP_DIR="/Users/flash/CODING PROJECTS/UI STACK"
LOG_FILE="$APP_DIR/masterson-ui.log"

# Change to app directory
cd "$APP_DIR"

# Check if node is installed
if ! command -v node &> /dev/null; then
    osascript -e 'display alert "Node.js Not Found" message "Please install Node.js to run Masterson UI." as critical'
    exit 1
fi

# Check if node_modules exists
if [ ! -d "node_modules" ]; then
    osascript -e 'display notification "Installing dependencies..." with title "Masterson UI"'
    npm install >> "$LOG_FILE" 2>&1
fi

# Start the dev server
osascript -e 'display notification "Starting Masterson UI..." with title "Masterson UI"'

# Kill any existing process on port 5173
lsof -ti:5173 | xargs kill -9 2>/dev/null

# Start Vite dev server and open browser
npm run dev >> "$LOG_FILE" 2>&1 &

# Wait for server to start
sleep 3

# Open in default browser
open "http://localhost:5173"
