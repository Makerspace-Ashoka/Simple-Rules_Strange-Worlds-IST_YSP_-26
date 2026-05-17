#!/usr/bin/env bash
set -euo pipefail

if [[ $# -lt 1 ]]; then
  echo "Usage: $0 /path/to/backup.sql [/path/to/.env]" >&2
  exit 1
fi

BACKUP_FILE="$1"
ENV_FILE="${2:-/opt/cellular-automata-workshop/.env}"

if [[ ! -f "$BACKUP_FILE" ]]; then
  echo "Backup file not found: $BACKUP_FILE" >&2
  exit 1
fi

set -a
source "$ENV_FILE"
set +a

cat "$BACKUP_FILE" | docker compose --env-file "$ENV_FILE" exec -T postgres \
  psql -U "$POSTGRES_USER" -d "$POSTGRES_DB"

echo "Restore completed from $BACKUP_FILE"
