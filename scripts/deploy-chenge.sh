#!/usr/bin/env bash

set -euo pipefail

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"

export SSH_TARGET="${SSH_TARGET:-ubuntu@170.106.181.89}"
export APP_DIR="${APP_DIR:-/opt/NotionNext}"
export REMOTE_NAME="${REMOTE_NAME:-origin}"
export BRANCH="${BRANCH:-main}"
export PUSH_BEFORE_DEPLOY="${PUSH_BEFORE_DEPLOY:-true}"
export PUSH_REMOTE="${PUSH_REMOTE:-origin}"
export PUSH_BRANCH="${PUSH_BRANCH:-main}"
export ALLOW_DIRTY_REMOTE="${ALLOW_DIRTY_REMOTE:-true}"
export SYNC_NEXT_PUBLIC_VERSION="${SYNC_NEXT_PUBLIC_VERSION:-true}"
export INSTALL_CMD="${INSTALL_CMD:-yarn install --frozen-lockfile --ignore-engines}"
export BUILD_CMD="${BUILD_CMD:-./node_modules/.bin/next build}"
export RESTART_CMD="${RESTART_CMD:-pm2 restart notionnext-blog}"
export HEALTHCHECK_CMD="${HEALTHCHECK_CMD:-curl -fsS http://127.0.0.1:3000 >/dev/null}"

exec "$SCRIPT_DIR/deploy-remote.sh" "$@"
