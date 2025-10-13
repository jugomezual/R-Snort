#!/usr/bin/env bash
set -euo pipefail
source "$(dirname "$0")/00_common.sh"
exec > >(tee -a "$LOG_DIR/03_compile_backend.log") 2>&1

# 🛠️ Parar el servicio antes de recompilar
SERVICE=rsnort-backend
if systemctl is-active --quiet "$SERVICE"; then
  log "Parando servicio $SERVICE para recompilar…"
  sudo systemctl stop "$SERVICE"
fi

# 🛠️ Asegura que el wrapper tenga permisos de ejecución
chmod +x "$BACK_DIR/mvnw" 2>/dev/null || true

pushd "$BACK_DIR" >/dev/null

# Usa el wrapper si es ejecutable; si no, usa Maven global
if [[ -x ./mvnw ]]; then
  ./mvnw clean package -DskipTests
else
  mvn clean package -DskipTests
fi

popd >/dev/null

log "✔ Backend empaquetado."
