# R-SNORT WebApp: Centralized Intrusion Monitoring and Management System

**R-SNORT WebApp** is a comprehensive and modular Network Intrusion Detection and Management System (NIDS), designed for easy deployment in small local networks (SOHO/SMB) utilizing **Snort 3**, **Grafana**, and modern technologies like **Spring Boot** and **Angular**. The application enables centralized supervision of multiple distributed agents, facilitating forensic analysis, alert downloading, and rule management from a single web graphical interface.

---

## 🌐 Project Structure

```
r-snort-central-module-installer/
├── rsnort-backend/              # Spring Boot Backend
├── rsnort-frontend/             # Angular Frontend
└── scripts/                     # Installation and automated deployment scripts
```

---

## ⚙️ Technologies Used

- 🔐 **Snort 3.1.84.0**: NIDS Engine on each agent.
- 🧠 **Spring Boot 3**: REST Backend for the central module.
- 🖥️ **Angular 19**: Standalone Frontend for the web UI.
- 📊 **Grafana 12**: Advanced visualization of alerts and system metrics.
- 🐬 **MariaDB**: Storage for alerts and rules.
- 📦 **.deb Installers**: Automatic, zero-intervention installation.

---

## 🧩 System Components

### 1. R-Snort Agent
Each Raspberry Pi or Ubuntu server acts as an autonomous agent that:
- Detects malicious traffic with Snort 3.
- Generates JSON alerts that are automatically rotated and archived.
- Exposes a REST API (`agent_api.py`) with `/alerts`, `/rules`, `/status`, etc., endpoints.
- Collects system metrics (`metrics_timer.py`).
- Installs in seconds via a `.deb` package.

### 2. Central Module
- Acts as both an agent and the primary server.
- Aggregates alerts from multiple agents.
- Allows remote management from the web frontend.
- Offers pre-configured Grafana dashboards.
- Manages users with roles and secure access.

---

## 🚀 Automatic Installation

> Prerequisites: Ubuntu Server 24.04+ or upper, sudo access, Internet connection.

```bash
git clone [https://github.com/jugomezual/rsnort-webapp.git](https://github.com/jugomezual/rsnort-webapp.git)
cd rsnort-central-module-installer/scripts
chmod +x run_all.sh
sudo ./run_all.sh


This automatically compiles and installs:
- The Angular frontend and Spring Boot backend
- MariaDB database
- Snort 3 with custom configuration
- Pre-configured Grafana dashboards
- System service for rsnort_webapp

---

## 🛡️ Key Features
- 📡 Real-time detection of ICMP, SNMP, DNS attacks, data exfiltration, etc.
- 📂 Forensic log archiving with automatic rotation via logrotate.
- 🔍 Professional graphical interface with dark panel and alert visualization.
- 🔐 Secure login with roles and rule management from the frontend.
- 🌐 Management of multiple agents from a single webApp.
- 📥 Selective download of alerts and archived logs per agent.


---

## 🔧 Scripts Incluidos

| Script                | Función principal                                               |
|----------------------|------------------------------------------------------------------|
| `00_common.sh`       | Common variables and auxiliary functions                       |
| `01_dependencies.sh` | Installation of system dependencies                    |
| `02_compile_frontend.sh` | Compiles Angular in production mode                        |
| `03_compile_backend.sh`  | Packages the backend as a .jar with Maven                |
| `04_prepare_db.sh`   | Creates the initial database and structure                    |
| `05_add_admin_user.sh` | Inserts a predefined administrator user               |
| `06_setup_agents.sh` | Adds agents with automatic check (ping + /docs)    |
| `07_install_service.sh` | Installs the systemd service for automatic execution       |
| `run_all.sh`         | 	Executes the entire installation process from start to finish      |

---

## 📚 Technical Documentation
- snort-agent and rsnort_webapp are separated by function.
- All REST endpoints are documented under /docs of each agent.
- Includes compatibility with systems without NUMA (automatic deactivation).



```
## License
This project is released under the MIT License. See [LICENSE](https://choosealicense.com/licenses/mit/) for details.

---
## Contact
**Deian Orlando Petrovics T.**

