#!/usr/bin/env bash
# ABOUTME: Stops and removes the Datadog Agent Docker container
# ABOUTME: Counterpart to setup-dd-agent.sh — safe to run if container doesn't exist

set -uo pipefail

readonly CONTAINER_NAME="dd-agent"

# Check Docker is available
if ! command -v docker &>/dev/null; then
  echo "❌ Docker is not installed or not in PATH"
  exit 1
fi

# Check if container exists
if ! docker ps -a --format '{{.Names}}' | grep -q "^${CONTAINER_NAME}$"; then
  echo "ℹ️  No DD Agent container found — nothing to tear down"
  exit 0
fi

# Stop if running
if docker ps --format '{{.Names}}' | grep -q "^${CONTAINER_NAME}$"; then
  echo "🛑 Stopping DD Agent container..."
  docker stop "$CONTAINER_NAME" >/dev/null
fi

# Remove container
echo "🗑️  Removing DD Agent container..."
docker rm "$CONTAINER_NAME" >/dev/null

echo "✅ DD Agent container removed"
