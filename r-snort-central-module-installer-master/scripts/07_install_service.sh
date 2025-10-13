#!/usr/bin/env bash
set -euo pipefail
source "$(dirname "$0")/00_common.sh"
exec > >(tee -a "$LOG_DIR/07_install_service.log") 2>&1

# 1. Copiar artefactos al destino
install -d -m 755 "$BUILD_DIR"
cp "$BACK_DIR/target/"*.jar "$BUILD_DIR/rsnort.jar"

# (❌ eliminado: copiar frontend, ya va dentro del JAR)

# 2. Variables de entorno — dos archivos:
#    a)  /etc/rsnort-backend/rsnort.env  (solo para systemd, sin export)
#    b)  /etc/profile.d/rsnort.sh        (para shells interactivos, con export)

SYS_ENV=/etc/rsnort-backend/rsnort.env
install -d -m 755 /etc/rsnort-backend
cat >"$SYS_ENV" <<EOF
RSNORT_DB_USERNAME=$RSNORT_DB_USERNAME
RSNORT_DB_PASSWORD=$RSNORT_DB_PASSWORD
RSNORT_DB_NAME=$RSNORT_DB_NAME
RSNORT_DB_HOST=$RSNORT_DB_HOST
EOF
chmod 600 "$SYS_ENV"

if [[ ! -f "$ENV_FILE" ]]; then
cat >"$ENV_FILE" <<EOF
export RSNORT_DB_USERNAME="$RSNORT_DB_USERNAME"
export RSNORT_DB_PASSWORD="$RSNORT_DB_PASSWORD"
export RSNORT_DB_NAME="$RSNORT_DB_NAME"
export RSNORT_DB_HOST="$RSNORT_DB_HOST"
EOF
chmod 644 "$ENV_FILE"
fi

# 3. Servicio systemd
SERVICE=/etc/systemd/system/rsnort-backend.service
cat >"$SERVICE" <<EOF
[Unit]
Description=R-Snort Backend
After=network.target mariadb.service

[Service]
User=root
WorkingDirectory=$BUILD_DIR
ExecStart=/usr/bin/java -jar $BUILD_DIR/rsnort.jar
EnvironmentFile=$SYS_ENV
SuccessExitStatus=143
Restart=on-failure
ProtectSystem=full
PrivateTmp=true
NoNewPrivileges=true

[Install]
WantedBy=multi-user.target
EOF

systemctl daemon-reload
systemctl enable --now rsnort-backend
log "✔ Servicio rsnort-backend activo."
