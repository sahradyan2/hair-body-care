#!/usr/bin/env bash
set -euo pipefail

REMOTE_USER="${REMOTE_USER:-deploy}"
REMOTE_HOST="${REMOTE_HOST:-example.com}"
REMOTE_PATH="${REMOTE_PATH:-/var/www/site/public_html}"

if [[ -z "${REMOTE_USER}" || -z "${REMOTE_HOST}" || -z "${REMOTE_PATH}" ]]; then
  echo "Missing deploy config. Set REMOTE_USER, REMOTE_HOST and REMOTE_PATH first."
  echo "Example:"
  echo "  REMOTE_USER=deploy REMOTE_HOST=example.com REMOTE_PATH=/var/www/site/public_html ./scripts/deploy-prod.sh"
  exit 1
fi

PROJECT_ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"

rsync -avz --delete \
  --exclude-from="$PROJECT_ROOT/.rsyncignore" \
  "$PROJECT_ROOT/" \
  "$REMOTE_USER@$REMOTE_HOST:$REMOTE_PATH/"

echo "Deploy completed to $REMOTE_USER@$REMOTE_HOST:$REMOTE_PATH"
