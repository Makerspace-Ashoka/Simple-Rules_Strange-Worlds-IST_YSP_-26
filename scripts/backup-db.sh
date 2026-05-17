#!/usr/bin/env bash
set -euo pipefail

OUTPUT_PATH="${1:-/opt/cellular-automata-workshop/backups/ca_workshop_$(date +%F_%H-%M).sql}"
ENV_FILE="${2:-/opt/cellular-automata-workshop/.env}"

mkdir -p "$(dirname "$OUTPUT_PATH")"

set -a
source "$ENV_FILE"
set +a

docker compose --env-file "$ENV_FILE" exec -T postgres \
  pg_dump -U "$POSTGRES_USER" "$POSTGRES_DB" > "$OUTPUT_PATH"

echo "Backup written to $OUTPUT_PATH"
