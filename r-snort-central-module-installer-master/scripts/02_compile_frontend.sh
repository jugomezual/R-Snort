#!/usr/bin/env bash
set -euo pipefail
source "$(dirname "$0")/00_common.sh"
exec > >(tee -a "$LOG_DIR/02_compile_frontend.log") 2>&1

IP_LOCAL=$(detect_ip); log "IP local: $IP_LOCAL"

# 1. Inyecta la URL del backend en Angular
ENV_PROD="$FRONT_DIR/src/environments/environment.prod.ts"
sed -i "s|backendUrl: '.*'|backendUrl: 'http://$IP_LOCAL:8080'|" "$ENV_PROD"

# 2. Compila Angular
pushd "$FRONT_DIR" >/dev/null
npm install
ng build --configuration production
popd >/dev/null
log "✔ Frontend compilado."

# 3. ✅ Copia la SPA a src/main/resources/static/ para que vaya DENTRO del JAR
TARGET_STATIC="$BACK_DIR/src/main/resources/static"
rsync -a --delete \
      "$FRONT_DIR/dist/rsnort-frontend/browser/" \
      "$TARGET_STATIC/"
log "✔ Copiados $(find "$TARGET_STATIC" -type f | wc -l) ficheros estáticos."
