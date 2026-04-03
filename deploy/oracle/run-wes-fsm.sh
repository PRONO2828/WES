#!/usr/bin/env bash
set -euo pipefail

ROOT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")/../.." && pwd)"
DATA_DIR="${WES_FSM_DATA_DIR:-$HOME/wes-fsm-data}"
IMAGE_NAME="${WES_FSM_IMAGE:-wes-fsm}"
CONTAINER_NAME="${WES_FSM_CONTAINER:-wes-fsm}"

if [[ -z "${JWT_SECRET:-}" ]]; then
  echo "Set JWT_SECRET before running this script." >&2
  exit 1
fi

if [[ -z "${WES_FSM_LOGIN_PASSWORD:-}" ]]; then
  echo "Set WES_FSM_LOGIN_PASSWORD before running this script." >&2
  exit 1
fi

mkdir -p "$DATA_DIR"

if [[ ! -f "$DATA_DIR/wes-fsm-store.json" && -f "$ROOT_DIR/database/wes-fsm-store.json" ]]; then
  cp "$ROOT_DIR/database/wes-fsm-store.json" "$DATA_DIR/wes-fsm-store.json"
fi

docker build -t "$IMAGE_NAME" "$ROOT_DIR"
docker rm -f "$CONTAINER_NAME" >/dev/null 2>&1 || true
docker run -d \
  --name "$CONTAINER_NAME" \
  --restart unless-stopped \
  -p 4000:4000 \
  -e PORT=4000 \
  -e STATIC_ROOT=/app \
  -e JWT_SECRET="$JWT_SECRET" \
  -e WES_FSM_LOGIN_PASSWORD="$WES_FSM_LOGIN_PASSWORD" \
  -v "$DATA_DIR:/app/database" \
  "$IMAGE_NAME"

echo "WES FSM is starting."
echo "Web app: http://$(hostname -I | awk '{print $1}'):4000/"
echo "API: http://$(hostname -I | awk '{print $1}'):4000/api"

