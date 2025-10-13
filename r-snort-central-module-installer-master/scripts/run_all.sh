#!/usr/bin/env bash
set -euo pipefail

# =============================================================
#  Instalador vistoso del módulo central (R‑SNORT FRONTEND) ✨
#  Conserva la lógica original pero añade colores, progreso y
#  un resumen final al estilo R‑Snort3/snort‑agent.
# =============================================================

cd "$(dirname "$0")"

# ---------------------- Colores y símbolos -------------------
GREEN="\e[32m"; RED="\e[31m"; YELLOW="\e[33m"; BLUE="\e[34m"; MAGENTA="\e[35m"; CYAN="\e[36m"; BOLD="\e[1m"; RESET="\e[0m"
CHECK="${GREEN}✓${RESET}"; CROSS="${RED}✗${RESET}"; ARROW="${CYAN}▶${RESET}"; SEPARATOR="${MAGENTA}────────────────────────────────────────────${RESET}"

EXEC_USER=${SUDO_USER:-$(whoami)}  # Usuario real que llamó al script

# Ejecuta un comando como el usuario original (no root)
as_user() { sudo -u "$EXEC_USER" -- "$@"; }

# ---------------------- Encabezado bonito --------------------
echo -e "\n${CYAN}${BOLD}╔════════════════════════════════════════════╗${RESET}"
echo -e "${CYAN}${BOLD}║     🚀 Instalador de R‑SNORT FRONTEND      ║${RESET}"
echo -e "${CYAN}${BOLD}╚════════════════════════════════════════════╝${RESET}"

# ------------------ Función para esperar dpkg ----------------
wait_for_dpkg_lock() {
  while fuser /var/lib/dpkg/lock-frontend >/dev/null 2>&1; do
    echo -e "${YELLOW}[INFO] Esperando a que se libere el lock de dpkg/apt...${RESET}"
    sleep 5
  done
}

# ------------------- Paso 1: dependencias --------------------
echo -e "\n${ARROW} ${BOLD}Instalando dependencias...${RESET}"
wait_for_dpkg_lock
sudo ./01_dependencies.sh
echo -e "${CHECK} Dependencias instaladas"

# ------------------- Paso 2: Angular -------------------------
echo -e "\n${ARROW} ${BOLD}Compilando frontend Angular...${RESET}"
as_user ./02_compile_frontend.sh
echo -e "${CHECK} Frontend compilado"

# ------------------- Paso 3: Backend -------------------------
echo -e "\n${ARROW} ${BOLD}Compilando backend Spring Boot...${RESET}"
as_user ./03_compile_backend.sh
echo -e "${CHECK} Backend compilado"

# ------------- Paso 4‑7: scripts root restantes --------------
for step in 04_prepare_db 05_add_admin_user 06_setup_agents 07_install_service; do
  echo -e "\n${SEPARATOR}"
  echo -e "${ARROW} Ejecutando ${BOLD}${step}.sh${RESET}"
  wait_for_dpkg_lock
  sudo "./${step}.sh"
  echo -e "${CHECK} ${step}.sh completado"
  sleep 0.3
done

# ====================== RESUMEN DEL SISTEMA ==================
HOSTNAME=$(hostname)
UPTIME=$(uptime -p | cut -d ' ' -f2-)
read -r RAM_USED RAM_TOTAL <<< $(free -h --si | awk '/Mem:/ {print $3, $2}')
DISK_USAGE=$(df -h / | awk 'NR==2 {print $3" usados de "$2}')
CPU_MODEL=$(lscpu | grep -m1 "Model name" | sed 's/Model name:[[:space:]]*//')
NODE_VER=$(node -v 2>/dev/null || echo "N/D")
JAVA_VER=$(java -version 2>&1 | head -n1 | awk -F'"' '{print $2}' || true)
SERVICE_NAME="r-snort-frontend"
ACTIVE_IF=$(ip -o -4 route show to default | awk '{print $5}' | head -n1)

print_summary() {
  echo -e "\n${SEPARATOR}"
  echo -e "${BLUE}${BOLD}[*] Resumen del sistema tras la instalación:${RESET}\n"
  printf " ${CYAN}📛  Hostname${RESET}:             %s\n" "$HOSTNAME"
  printf " ${CYAN}⏱   Uptime${RESET}:               %s\n" "$UPTIME"
  printf " ${CYAN}🧠  RAM usada${RESET}:            %s / %s\n" "$RAM_USED" "$RAM_TOTAL"
  printf " ${CYAN}💾  Espacio raíz${RESET}:         %s\n" "$DISK_USAGE"
  printf " ${CYAN}⚙️   CPU${RESET}:                 %s\n" "$CPU_MODEL"
  printf " ${CYAN}🅽  Node.js versión${RESET}:      %s\n" "$NODE_VER"
  printf " ${CYAN}☕  Java versión${RESET}:         %s\n" "${JAVA_VER:-N/D}"
  printf " ${CYAN}🌐  Interfaz activa${RESET}:      %s\n" "$ACTIVE_IF"
  echo
}

print_summary

# -------------------- Estado del servicio --------------------
if systemctl list-unit-files | grep -q "${SERVICE_NAME}.service"; then
  if systemctl is-active --quiet "$SERVICE_NAME"; then
    echo -e "${CHECK} ${SERVICE_NAME} está en ejecución"
  else
    echo -e "${CROSS} ${SERVICE_NAME} no se está ejecutando. Usa 'systemctl status ${SERVICE_NAME}' para más detalles."
  fi
else
  echo -e "${YELLOW}[INFO] No se encontró el servicio ${SERVICE_NAME}; quizá se llame distinto o no se instaló aún.${RESET}"
fi

# ------------------------- URLs ------------------------------
IP=$(hostname -I | awk '{print $1}')

echo -e "\n${GREEN}${BOLD}✔ Instalación completada con éxito${RESET}"
echo -e "🌐 ${BOLD}Accede ahora a:${RESET} ${BLUE}http://$IP:8080${RESET}\n"

# =============================================================
#  Fin del instalador
# =============================================================
