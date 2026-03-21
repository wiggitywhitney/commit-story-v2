#!/usr/bin/env bash
# ABOUTME: Starts a Datadog Agent Docker container with OTLP HTTP receiver on port 4318
# ABOUTME: Injects DD_API_KEY via vals automatically — just run the script directly

set -uo pipefail

readonly CONTAINER_NAME="dd-agent"
readonly OTLP_PORT=4318

# If DD_API_KEY is not set, re-exec with vals to inject secrets
if [[ -z "${DD_API_KEY:-}" ]]; then
  SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
  VALS_FILE="$SCRIPT_DIR/../.vals.yaml"

  if [[ ! -f "$VALS_FILE" ]]; then
    echo "❌ .vals.yaml not found at $VALS_FILE"
    echo "   DD_API_KEY must be set in the environment or available via vals."
    exit 1
  fi

  if ! command -v vals &>/dev/null; then
    echo "❌ vals is not installed"
    echo "   Install: brew install helmfile/tap/vals"
    exit 1
  fi

  exec vals exec -f "$VALS_FILE" -- "$0" "$@"
fi

# Check Docker is available
if ! command -v docker &>/dev/null; then
  echo "❌ Docker is not installed or not in PATH"
  exit 1
fi

if ! docker info &>/dev/null; then
  echo "❌ Docker daemon is not running"
  echo "   Start Docker Desktop or the Docker daemon first."
  exit 1
fi

# Check if container already exists
if docker ps -a --format '{{.Names}}' | grep -q "^${CONTAINER_NAME}$"; then
  if docker ps --format '{{.Names}}' | grep -q "^${CONTAINER_NAME}$"; then
    echo "✅ DD Agent container is already running"
    echo "   OTLP HTTP endpoint: http://localhost:${OTLP_PORT}"
    exit 0
  else
    echo "🔄 Removing stopped DD Agent container..."
    docker rm "$CONTAINER_NAME" >/dev/null
  fi
fi

# Check port availability
if lsof -i ":${OTLP_PORT}" &>/dev/null; then
  echo "❌ Port ${OTLP_PORT} is already in use"
  echo "   Check what's using it: lsof -i :${OTLP_PORT}"
  exit 1
fi

# Start the DD Agent with OTLP enabled
echo "🚀 Starting Datadog Agent with OTLP receiver..."
docker run -d --name "$CONTAINER_NAME" \
  -e DD_API_KEY="$DD_API_KEY" \
  -e DD_OTLP_CONFIG_RECEIVER_PROTOCOLS_HTTP_ENDPOINT=0.0.0.0:${OTLP_PORT} \
  -e DD_SITE=datadoghq.com \
  -p ${OTLP_PORT}:${OTLP_PORT} \
  gcr.io/datadoghq/agent:latest >/dev/null

echo "✅ DD Agent started"
echo "   Container: ${CONTAINER_NAME}"
echo "   OTLP HTTP endpoint: http://localhost:${OTLP_PORT}"
echo ""
echo "   To stop: scripts/teardown-dd-agent.sh"
echo "   To view logs: docker logs -f ${CONTAINER_NAME}"
