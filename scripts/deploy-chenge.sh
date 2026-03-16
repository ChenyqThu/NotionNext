#!/usr/bin/env bash

set -euo pipefail

SSH_TARGET="${SSH_TARGET:-ubuntu@170.106.181.89}"
APP_DIR="${APP_DIR:-/opt/NotionNext}"
PUSH_REMOTE="${PUSH_REMOTE:-origin}"
PUSH_BRANCH="${PUSH_BRANCH:-main}"
RESTART_CMD="${RESTART_CMD:-pm2 restart notionnext-blog}"
HEALTHCHECK_CMD="${HEALTHCHECK_CMD:-curl -fsS http://127.0.0.1:3000 >/dev/null}"
LOCAL_HEAD="$(git rev-parse --short HEAD)"

quote() {
  printf '%q' "$1"
}

app_dir_q="$(quote "$APP_DIR")"
restart_cmd_q="$(quote "$RESTART_CMD")"
healthcheck_cmd_q="$(quote "$HEALTHCHECK_CMD")"
local_head_q="$(quote "$LOCAL_HEAD")"

echo "==> Pushing local HEAD to ${PUSH_REMOTE}/${PUSH_BRANCH}"
git push "$PUSH_REMOTE" "HEAD:$PUSH_BRANCH"

echo "==> Ensuring remote directory ${SSH_TARGET}:${APP_DIR}"
ssh "$SSH_TARGET" "mkdir -p $(quote "$APP_DIR")"

echo "==> Syncing files to ${SSH_TARGET}:${APP_DIR}"
rsync -az --delete \
  --exclude '.git' \
  --exclude '.env.local' \
  --exclude '.next' \
  --exclude 'node_modules' \
  --exclude '.omx' \
  ./ "${SSH_TARGET}:${APP_DIR}/"

echo "==> Running remote deploy steps"
ssh "$SSH_TARGET" bash -s <<REMOTE
set -euo pipefail

APP_DIR=$app_dir_q
RESTART_CMD=$restart_cmd_q
HEALTHCHECK_CMD=$healthcheck_cmd_q
LOCAL_HEAD=$local_head_q

cd "\$APP_DIR"

package_version="\$(node -p "require('./package.json').version")"

if [[ -f .env.local ]]; then
  if grep -q '^NEXT_PUBLIC_VERSION=' .env.local; then
    sed -i "s/^NEXT_PUBLIC_VERSION=.*/NEXT_PUBLIC_VERSION=\${package_version}/" .env.local
  else
    printf '\nNEXT_PUBLIC_VERSION=%s\n' "\$package_version" >> .env.local
  fi
fi

echo "==> Installing dependencies"
yarn install --frozen-lockfile --ignore-engines

echo "==> Building application"
./node_modules/.bin/next build

echo "==> Restarting service"
eval "\$RESTART_CMD"
pm2 save >/dev/null

echo "==> Running health check"
eval "\$HEALTHCHECK_CMD"

echo "==> Deployed commit: \$LOCAL_HEAD"
echo "==> Package version: \$package_version"
REMOTE

echo "==> Deployment finished"
