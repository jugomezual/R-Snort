#!/usr/bin/env bash
set -euo pipefail
source "$(dirname "$0")/00_common.sh"
exec > >(tee -a "$LOG_DIR/05_add_admin_user.log") 2>&1

read -rp "Correo para ADMIN: " ADMIN_EMAIL
while true; do
  read -rsp "Contraseña: " P1 && echo
  read -rsp "Confirmar  : " P2 && echo
  [[ "$P1" == "$P2" ]] && break
  warn "No coinciden. Intenta otra vez."
done
HASH=$(printf "%s\n" "$P1" | htpasswd -inBC 10 "" | tr -d ':\n')

DB_CNF=/etc/rsnort-agent/db.cnf
mysql --defaults-extra-file="$DB_CNF" <<SQL
INSERT IGNORE INTO users (email, password_hash, role, is_active)
VALUES ('$ADMIN_EMAIL', '$HASH', 'ADMIN', 1);
SQL
log "✔ Usuario ADMIN registrado."
