#!/usr/bin/env bash
set -euo pipefail

# ---------- Variables globales ----------
export RSNORT_DB_USERNAME="rsnort"
export RSNORT_DB_PASSWORD="cambio_me"
export RSNORT_DB_NAME="rsnort_agent"
export RSNORT_DB_HOST="127.0.0.1"

ROOT_DIR="$(realpath "$(dirname "${BASH_SOURCE[0]}")/..")"
FRONT_DIR="$ROOT_DIR/rsnort-frontend"
BACK_DIR="$ROOT_DIR/rsnort-backend"
BUILD_DIR="/opt/rsnort-backend"
ENV_FILE="/etc/profile.d/rsnort.sh"
LOG_DIR="/var/log/rsnort-install"
mkdir -p "$LOG_DIR"

# ---------- Helpers ----------
log()   { echo -e "\e[32m[INFO]\e[0m $*"; }
warn()  { echo -e "\e[33m[WARN]\e[0m $*"; }
error() { echo -e "\e[31m[ERR ]\e[0m $*" >&2; }
die()   { error "$*"; exit 1; }

# Primera IP v4 global
detect_ip() {
  ip -4 -o addr show scope global \
    | awk '{print $4}' \
    | cut -d/ -f1 \
    | head -n1
}
