# R-SNORT Installer

Automated installer for **Snort 3.1.84** optimized for the **Raspberry Pi 5** with ARM64 architecture. This project provides a complete Network Intrusion Detection System (NIDS) configured to secure SOHO networks, aimed at experimental, educational, or small business environments.

## Features

- Compilation of Snort 3 and all its dependencies from source code.
- Advanced configuration of `snort.lua` for Linux environments and asymmetric networks.
- Integration with ClamAV for malware detection.
- Fully configured and enabled systemd service.
- Integrated community and custom rules.
- Temporary swap enabled to prevent out-of-memory errors.
- Validation of dependencies and system status.
- Active preprocessors.

## Requirements

- Raspberry Pi 5 (ARM64) running Ubuntu Server or Desktop 24.04.
- User with sudo privileges.
- Internet connection during installation.
- At least 8 GB of free storage.

## Project Structure

```
.
├── install_rsnort.sh            # Main installation script
├── r-snort-deb/                 # Custom .deb package structure
│   ├── DEBIAN/                  # Package maintenance scripts
│   └── opt/r-snort/            
│       ├── bin/                # Internal scripts
│       ├── configuracion/      # Rules and configuration files
│       └── software/           # Tarballs of software to be compiled
└── r-snort-deb.deb             # Installable .deb package
```

## Installation

### Option A: From Source Code

```bash
git clone https://github.com/deianp189/r-snort-installer.git
cd r-snort-installer
sudo ./install_rsnort.sh
```

This script:
- Updates the system
- Installs dependencies using apt
- Installs r-snort-deb.deb or builds it if it doesn't exist
- Executes the entire automated installation flow
    

### Option B: Direct .deb Package Installation

```bash
sudo dpkg -i r-snort-deb.deb
sudo apt --fix-broken install -y
```

## System Usage

The Snort service is installed as snort.service and is enabled on startup:

```bash
sudo systemctl status snort
sudo journalctl -u snort -f
```

Binaries, configurations, and rules are installed under /usr/local/snort/.

## Updates and Maintenance

- To update ClamAV signatures:
  ```bash
  sudo freshclam
  ```

- To edit custom rules:
  ```bash
  sudo nano /usr/local/snort/etc/snort/custom.rules
  sudo systemctl restart snort
  ```

- To uninstall the system:
  ```bash
  sudo systemctl stop snort
  sudo systemctl disable snort
  sudo rm -rf /usr/local/snort /etc/systemd/system/snort.service /var/log/snort
  sudo apt remove --purge r-snort -y
  sudo apt autoremove -y
  ```


### Current Version

```
R-SNORT Installer v1.0.0
```


## Contact

**Deian Orlando Petrovics T.**


## License

MIT License. Free to use, modify, and distribute with attribution.

