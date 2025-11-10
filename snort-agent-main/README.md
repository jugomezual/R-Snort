# Snort Agent

Modular system to convert Snort 3 into a managed agent via a REST API, featuring automatic ingestion, system metrics, and Grafana visualization.

---

## 🔎 Description

**Snort Agent** transforms a standard **Snort 3** installation into a complete monitoring environment for SMEs or home networks:

* Automatic alert ingestion from `alert_json.txt`
* SQLite database storing alerts and metrics
* REST API (FastAPI) with Swagger documentation
* Automatic Grafana dashboards (with anonymous access)
* Modular scripts for complete, non-interventional installation

---

## 🚀 Key Features

* "One-click" deployment compatible with Raspberry Pi and Ubuntu Server
* Grafana Dashboard automatically configured using the `${snort}` variable
* REST API to query alerts, metrics, rules, and restart Snort
* Python service for real-time ingestion and system metrics collection
* Logrotate + cron configured by default for rotation and backup

---

## 📋 Requirements

* Ubuntu 22.04+ or upper
* Python 3.8+, Bash, SQLite, Grafana, Snort 3
* Root access during installation

---

## 🛠️ Installation

```bash
git clone https://github.com/deianp189/snort-agent.git
cd snort-agent
sudo ./install.sh

---

## 🔗 Access and Verification

```bash
systemctl status snort rsnort-api rsnort-ingest rsnort-metrics.timer grafana-server
```

* API REST: [http://localhost:8080/docs](http://localhost:8080/docs)
* Grafana: [http://localhost:3000](http://localhost:3000)

---

## ⚙️ Configuration

### Snort (`snort.lua`)

Path: `/usr/local/snort/etc/snort/snort.lua`

```lua
alert_json = {
  file = true,
  limit = 50,
  fields = [[timestamp proto dir src_addr src_port dst_addr dst_port msg sid gid priority]]
}
```
### API (FastAPI)

| Método  | Ruta                               | Descripción                                        |
| ------- | ---------------------------------- | -------------------------------------------------- |
| GET     | `/status`                         | System status                                |
| GET     | `/services/status`                | Status of main services              |
| POST    | `/services/restart`               | Restarts the main service (Snort, etc.)       |
| GET     | `/alerts`                         | Get all current alerts                |
| GET     | `/alerts/last`                    | Get the last registered alert              |
| GET     | `/metrics`                        | System metrics (CPU, RAM, etc.)              |
| GET     | `/rules`                          | List of active rules                      |
| POST    | `/rules`                          | Add a new rule                           |
| DELETE  | `/rules/{sid}`                    | Delete a rule by its SID                   |
| GET     | `/archived-files`                 | List archived alert files          |
| GET     | `/archived-files/{filename}`      | Download an archived alert file      |
| GET     | `/download-alerts`                | Download active alerts in CSV format          |
| GET     | `/grafana/dashboard-url`          | Get main Grafana dashboard URL    |

### Grafana (`grafana.ini`)

```ini
[security]
allow_embedding = true

[auth.anonymous]
enabled = true

[auth.jwt]
enabled = false
```

### Log Rotation

* Logrotate: `/etc/logrotate.d/snort-alert-json`
* Cron diario: `/etc/cron.d/rsnort_backup` (01:00)

---

## 📊 Basic Usage
```bash
# View last 5 alerts
curl http://localhost:8080/alerts?limit=5

# View status
curl http://localhost:8080/status

# View metrics
curl http://localhost:8080/metrics?limit=10

# Change rules
curl -X PUT http://localhost:8080/rules \
     -H "Content-Type: text/plain" \
     --data-binary @my_rules.rules

# Restart Snort
curl -X POST http://localhost:8080/restart

```


## License
This project is released under the MIT License. See [LICENSE](https://choosealicense.com/licenses/mit/) for details.

---
## Contact
**Deian Orlando Petrovics T.**


