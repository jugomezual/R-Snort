#!/usr/bin/env bash
set -euo pipefail
source "$(dirname "$0")/00_common.sh"
exec > >(tee -a "$LOG_DIR/06_setup_agents.log") 2>&1

# Ruta nueva para compatibilidad de escritura desde el backend
AGENTS_DIR=/var/lib/rsnort-backend
AGENTS_JSON=$AGENTS_DIR/agents.json

# Asegura el directorio de destino con permisos adecuados
install -d -m 755 "$AGENTS_DIR"

# Detectar IP local y crear entrada del módulo central
IP_LOCAL=$(detect_ip)
log "✔ Agente central añadido automáticamente: central ($IP_LOCAL)"

# Crear archivo temporal
TMP_AGENTS=$(mktemp)
echo "{\"id\":\"central\",\"ip\":\"$IP_LOCAL\"}" > "$TMP_AGENTS"

# Solicitar más agentes
while true; do
  read -rp "¿Añadir otro agente? (y/N) " yn
  [[ "$yn" =~ ^[Yy]$ ]] || break
  read -rp "  ID: " ID
  read -rp "  IP: " IP
  echo "{\"id\":\"$ID\",\"ip\":\"$IP\"}" >> "$TMP_AGENTS"
done

# Generar archivo final
jq -s '.' "$TMP_AGENTS" > "$AGENTS_JSON"

# Establecer permisos de lectura/escritura para todos
chmod 666 "$AGENTS_JSON"

# Eliminar archivo temporal
rm -f "$TMP_AGENTS"

# Mostrar resumen
TOTAL=$(jq length "$AGENTS_JSON")
log "✔ Archivo $AGENTS_JSON creado con $TOTAL agente(s):"
jq -r '.[] | "   - \(.id) → \(.ip)"' "$AGENTS_JSON"
