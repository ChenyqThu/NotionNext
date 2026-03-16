#!/usr/bin/env bash

set -euo pipefail

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"

export SSH_TARGET="${SSH_TARGET:-ubuntu@170.106.181.89}"
export APP_DIR="${APP_DIR:-/opt/NotionNext}"
export REMOTE_NAME="${REMOTE_NAME:-origin}"
export BRANCH="${BRANCH:-main}"
export RESTART_CMD="${RESTART_CMD:-pm2 restart notionnext-blog}"
export HEALTHCHECK_CMD="${HEALTHCHECK_CMD:-curl -fsS http://127.0.0.1:3000 >/dev/null}"

exec "$SCRIPT_DIR/deploy-remote.sh" "$@"
