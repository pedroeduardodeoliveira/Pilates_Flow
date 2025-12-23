#!/bin/sh
set -e

# Function to handle shutdown signals
shutdown() {
    echo "Received shutdown signal, stopping nginx gracefully..."
    nginx -s quit
    exit 0
}

# Trap signals
trap shutdown SIGTERM SIGINT SIGQUIT

# Start nginx in background
nginx -g "daemon off;" &

# Wait for nginx process
wait $!