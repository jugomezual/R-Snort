# R-Snort

The architecture of R-Snort is modular, distributed, and scalable, designed to adapt to SOHO environments. The system consists of two main elements: the Snort agents—deployed on embedded systems like the Raspberry Pi—and a central module that facilitates comprehensive coordination, management, and monitoring.

Each Snort agent operates as an autonomous sensor, based on a customized version of Snort 3 to optimize performance on the limited hardware of embedded systems like the Raspberry Pi. These agents use a custom Snort installation compiled from its source code, incorporating various libraries for proper functioning, such as libdnet, libdaq, LuaJIT, Flex, Bison, and PCRE2 (figure 1). This allows for efficient and stable system execution on the Raspberry Pi platform.

Threat detection is based on a dual approach: official community rules and custom rules specifically developed to identify sensitive data (e.g., credentials or bank cards), thereby compensating for the absence of the old "Sensitive Data" preprocessor, which has been discontinued in Snort 3. Additionally, the implemented system uses various preprocessors like HTTP Inspect, SSL Inspector, Stream IP, Stream TCP, and Reputation, which provide an exhaustive inspection of traffic to detect evasion techniques and encrypted threats. Furthermore, they incorporate the ClamAV antivirus module, which complements Snort, providing an additional layer of security against malware through signature-based analysis.






## ⚖️ Licencia

Este proyecto está bajo la licencia **MIT**. Consulta [LICENSE](https://choosealicense.com/licenses/mit/) para más detalles.
