#!/usr/bin/env bash
set -euo pipefail
source "$(dirname "$0")/00_common.sh"
exec > >(tee -a "$LOG_DIR/04_prepare_db.log") 2>&1

DB_CNF=/etc/rsnort-agent/db.cnf
[[ -f $DB_CNF ]] || die "No existe $DB_CNF (ejecuta antes el instalador del agente)."

mysql --defaults-extra-file="$DB_CNF" <<'SQL'
CREATE TABLE IF NOT EXISTS users (
  id BIGINT PRIMARY KEY AUTO_INCREMENT,
  email VARCHAR(255) NOT NULL UNIQUE,
  password_hash VARCHAR(255) NOT NULL,
  role ENUM('ADMIN') DEFAULT 'ADMIN',
  is_active TINYINT(1) DEFAULT 0,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);
SQL
log "✔ Tabla 'users' asegurada."
