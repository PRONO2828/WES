#!/usr/bin/env bash
set -euo pipefail

ROOT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")/../.." && pwd)"

if [[ -z "${JWT_SECRET:-}" ]]; then
  echo "Set JWT_SECRET before running this script." >&2
  exit 1
fi

if [[ -z "${WES_FSM_LOGIN_PASSWORD:-}" ]]; then
  echo "Set WES_FSM_LOGIN_PASSWORD before running this script." >&2
  exit 1
fi

cd "$ROOT_DIR"
git pull --ff-only
bash deploy/oracle/run-wes-fsm.sh

