#!/usr/bin/env bash
# ---------------------------------------------------------------------------
# restore.sh  –  Auto-restore a .bak file into SQL Server (sqlserver-16)
#
# Usage:
#   ./restore.sh <path-to-bak-file> [database-name]
#
# Examples:
#   ./restore.sh backups/OMB_UAT_20250526.bak
#   ./restore.sh backups/OMB_UAT_20250526.bak OMB_UAT
# ---------------------------------------------------------------------------
set -euo pipefail

CONTAINER="sqlserver-16"
SA_PASSWORD="12345Abc%"
BACKUP_DIR_HOST="$(cd "$(dirname "$0")/backups" && pwd)"
BACKUP_DIR_CONTAINER="/var/opt/mssql/backup"

# ── Args ───────────────────────────────────────────────────────────────────
BAK_PATH="${1:-}"
if [[ -z "$BAK_PATH" ]]; then
  echo "Usage: $0 <path-to-bak-file> [database-name]"
  exit 1
fi

BAK_FILE="$(basename "$BAK_PATH")"
DB_NAME="${2:-${BAK_FILE%.bak}}"   # strip .bak if no name given

echo "==> Backup file : $BAK_FILE"
echo "==> Target DB   : $DB_NAME"
echo "==> Container   : $CONTAINER"

# ── Copy bak into container backup volume ─────────────────────────────────
echo ""
echo "[1/4] Copying $BAK_FILE into container ..."
docker cp "$BAK_PATH" "$CONTAINER:$BACKUP_DIR_CONTAINER/$BAK_FILE"

# ── Discover logical names inside the .bak ────────────────────────────────
echo "[2/4] Reading logical file names from backup ..."
LOGICAL_JSON=$(docker exec "$CONTAINER" /opt/mssql-tools/bin/sqlcmd \
  -S localhost -U sa -P "$SA_PASSWORD" \
  -Q "RESTORE FILELISTONLY FROM DISK = N'$BACKUP_DIR_CONTAINER/$BAK_FILE'" \
  -s "," -W 2>/dev/null \
  | awk -F',' 'NR>2 && $1!="" && $1!~/^-/ {print NR-2, $1, $2}')

echo "$LOGICAL_JSON"

# Parse first data file (Type D) and first log file (Type L)
DATA_LOGICAL=$(docker exec "$CONTAINER" /opt/mssql-tools/bin/sqlcmd \
  -S localhost -U sa -P "$SA_PASSWORD" \
  -Q "SET NOCOUNT ON; RESTORE FILELISTONLY FROM DISK = N'$BACKUP_DIR_CONTAINER/$BAK_FILE'" \
  -s "|" -W 2>/dev/null \
  | awk -F'|' 'NR>2 && $3=="D" && $1!~/^-/ {gsub(/ /,"",$1); print $1; exit}')

LOG_LOGICAL=$(docker exec "$CONTAINER" /opt/mssql-tools/bin/sqlcmd \
  -S localhost -U sa -P "$SA_PASSWORD" \
  -Q "SET NOCOUNT ON; RESTORE FILELISTONLY FROM DISK = N'$BACKUP_DIR_CONTAINER/$BAK_FILE'" \
  -s "|" -W 2>/dev/null \
  | awk -F'|' 'NR>2 && $3=="L" && $1!~/^-/ {gsub(/ /,"",$1); print $1; exit}')

echo "    Data logical name : $DATA_LOGICAL"
echo "    Log  logical name : $LOG_LOGICAL"

# ── Drop existing DB if present ───────────────────────────────────────────
echo "[3/4] Dropping existing database '$DB_NAME' (if exists) ..."
docker exec "$CONTAINER" /opt/mssql-tools/bin/sqlcmd \
  -S localhost -U sa -P "$SA_PASSWORD" \
  -Q "
IF DB_ID(N'$DB_NAME') IS NOT NULL
BEGIN
  ALTER DATABASE [$DB_NAME] SET SINGLE_USER WITH ROLLBACK IMMEDIATE;
  DROP DATABASE [$DB_NAME];
  PRINT 'Dropped existing database $DB_NAME';
END
ELSE
  PRINT 'Database $DB_NAME does not exist – skipping drop';
"

# ── Restore ────────────────────────────────────────────────────────────────
echo "[4/4] Restoring database '$DB_NAME' ..."
docker exec "$CONTAINER" /opt/mssql-tools/bin/sqlcmd \
  -S localhost -U sa -P "$SA_PASSWORD" \
  -Q "
RESTORE DATABASE [$DB_NAME]
FROM DISK = N'$BACKUP_DIR_CONTAINER/$BAK_FILE'
WITH
  MOVE N'$DATA_LOGICAL' TO N'/var/opt/mssql/data/${DB_NAME}.mdf',
  MOVE N'$LOG_LOGICAL'  TO N'/var/opt/mssql/data/${DB_NAME}_log.ldf',
  REPLACE,
  STATS = 10;
PRINT 'Restore complete.';
"

echo ""
echo "Done! Database [$DB_NAME] is ready."
