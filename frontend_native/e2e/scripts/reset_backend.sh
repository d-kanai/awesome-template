#!/usr/bin/env bash
set -euo pipefail

for attempt in $(seq 1 30); do
  if curl -sf http://localhost:8080/health >/dev/null; then
    break
  fi
  if [ "$attempt" -eq 30 ]; then
    echo "Backend health endpoint did not respond within 30 seconds" >&2
    exit 1
  fi
  sleep 1
done

status=$(curl -s -o /dev/null -w "%{http_code}" -X POST http://localhost:8080/test/reset || true)

if [ "$status" -ne 204 ]; then
  echo "Unexpected reset response status: $status" >&2
  exit 1
fi
