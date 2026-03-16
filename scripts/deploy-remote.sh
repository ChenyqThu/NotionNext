#!/usr/bin/env bash

set -euo pipefail

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
ENV_FILE="${DEPLOY_ENV_FILE:-$SCRIPT_DIR/deploy-remote.env}"

if [[ -f "$ENV_FILE" ]]; then
  set -a
  # shellcheck disable=SC1090
  source "$ENV_FILE"
  set +a
fi

SSH_TARGET="${SSH_TARGET:-${1:-}}"
if [[ $# -gt 0 ]]; then
  shift
fi

if [[ -z "$SSH_TARGET" ]]; then
  echo "error: missing SSH target. Set SSH_TARGET in $ENV_FILE or pass it as the first argument." >&2
  exit 1
fi

: "${APP_DIR:?Set APP_DIR in $ENV_FILE, for example /var/www/NotionNext}"

BRANCH="${BRANCH:-main}"
REMOTE_NAME="${REMOTE_NAME:-origin}"
PUSH_BEFORE_DEPLOY="${PUSH_BEFORE_DEPLOY:-false}"
PUSH_REMOTE="${PUSH_REMOTE:-origin}"
PUSH_BRANCH="${PUSH_BRANCH:-$BRANCH}"
ALLOW_DIRTY_REMOTE="${ALLOW_DIRTY_REMOTE:-false}"
SYNC_NEXT_PUBLIC_VERSION="${SYNC_NEXT_PUBLIC_VERSION:-false}"

PRE_DEPLOY_CMD="${PRE_DEPLOY_CMD:-:}"
INSTALL_CMD="${INSTALL_CMD:-yarn install --frozen-lockfile}"
BUILD_CMD="${BUILD_CMD:-yarn build}"
RESTART_CMD="${RESTART_CMD:-}"
POST_DEPLOY_CMD="${POST_DEPLOY_CMD:-:}"
HEALTHCHECK_CMD="${HEALTHCHECK_CMD:-:}"

if [[ "$PUSH_BEFORE_DEPLOY" == "true" ]]; then
  echo "==> Pushing local HEAD to ${PUSH_REMOTE}/${PUSH_BRANCH}"
  git push "$PUSH_REMOTE" "HEAD:$PUSH_BRANCH"
fi

echo "==> Deploying branch ${BRANCH} to ${SSH_TARGET}:${APP_DIR}"

quote() {
  printf '%q' "$1"
}

app_dir_q="$(quote "$APP_DIR")"
branch_q="$(quote "$BRANCH")"
remote_name_q="$(quote "$REMOTE_NAME")"
allow_dirty_remote_q="$(quote "$ALLOW_DIRTY_REMOTE")"
sync_next_public_version_q="$(quote "$SYNC_NEXT_PUBLIC_VERSION")"
pre_deploy_cmd_q="$(quote "$PRE_DEPLOY_CMD")"
install_cmd_q="$(quote "$INSTALL_CMD")"
build_cmd_q="$(quote "$BUILD_CMD")"
restart_cmd_q="$(quote "$RESTART_CMD")"
post_deploy_cmd_q="$(quote "$POST_DEPLOY_CMD")"
healthcheck_cmd_q="$(quote "$HEALTHCHECK_CMD")"

ssh "$SSH_TARGET" bash -s <<REMOTE
set -euo pipefail

APP_DIR=$app_dir_q
BRANCH=$branch_q
REMOTE_NAME=$remote_name_q
ALLOW_DIRTY_REMOTE=$allow_dirty_remote_q
SYNC_NEXT_PUBLIC_VERSION=$sync_next_public_version_q
PRE_DEPLOY_CMD=$pre_deploy_cmd_q
INSTALL_CMD=$install_cmd_q
BUILD_CMD=$build_cmd_q
RESTART_CMD=$restart_cmd_q
POST_DEPLOY_CMD=$post_deploy_cmd_q
HEALTHCHECK_CMD=$healthcheck_cmd_q

run_step() {
  local title="$1"
  local command="$2"

  if [[ -z "$command" || "$command" == ":" ]]; then
    return 0
  fi

  echo "==> ${title}"
  eval "$command"
}

cd "$APP_DIR"

if [[ ! -d .git ]]; then
  echo "error: ${APP_DIR} is not a git repository on the remote server." >&2
  exit 1
fi

if [[ "$ALLOW_DIRTY_REMOTE" != "true" ]] && [[ -n "$(git status --porcelain)" ]]; then
  echo "error: remote working tree is dirty. Commit/stash changes or set ALLOW_DIRTY_REMOTE=true." >&2
  exit 1
fi

echo "==> Fetching ${REMOTE_NAME}/${BRANCH}"
git fetch "$REMOTE_NAME" --prune

echo "==> Checking out ${BRANCH}"
git checkout "$BRANCH"
git pull --ff-only "$REMOTE_NAME" "$BRANCH"

if [[ "$SYNC_NEXT_PUBLIC_VERSION" == "true" ]] && [[ -f package.json ]] && [[ -f .env.local ]]; then
  package_version="$(node -p "require('./package.json').version")"

  if grep -q '^NEXT_PUBLIC_VERSION=' .env.local; then
    sed -i "s/^NEXT_PUBLIC_VERSION=.*/NEXT_PUBLIC_VERSION=${package_version}/" .env.local
  else
    printf '\nNEXT_PUBLIC_VERSION=%s\n' "$package_version" >> .env.local
  fi
fi

run_step "Running pre-deploy command" "$PRE_DEPLOY_CMD"
run_step "Installing dependencies" "$INSTALL_CMD"
run_step "Building application" "$BUILD_CMD"
run_step "Restarting service" "$RESTART_CMD"
run_step "Running post-deploy command" "$POST_DEPLOY_CMD"
run_step "Running health check" "$HEALTHCHECK_CMD"

echo "==> Remote HEAD: $(git rev-parse --short HEAD)"
REMOTE

echo "==> Deployment finished"
