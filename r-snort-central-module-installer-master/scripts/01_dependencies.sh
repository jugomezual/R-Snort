#!/usr/bin/env bash
set -euo pipefail
source "$(dirname "$0")/00_common.sh"

exec > >(tee -a "$LOG_DIR/01_dependencies.log") 2>&1
log "Instalando dependencias del sistema…"

apt-get update -y

# JDK 17 + Maven
apt-get install -y openjdk-17-jdk maven

# build-essential, curl, etc.
apt-get install -y build-essential git curl gnupg apache2-utils

# Node 18 LTS y npm (NodeSource)
if ! command -v node >/dev/null || [[ "$(node -v)" != v18* ]]; then
  curl -fsSL https://deb.nodesource.com/setup_18.x | bash -
  apt-get install -y nodejs
fi

# Angular CLI (global)
command -v ng >/dev/null || npm install -g @angular/cli

log "✔ Dependencias instaladas."
