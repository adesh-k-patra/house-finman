# Enterprise Risk Register

| Risk ID | Risk Category | Risk Scenario (Threat + Vulnerability) | Inherent Risk (I x L) | Mitigation Strategy (Controls) | Residual Risk | Owner | Status |
| :--- | :--- | :--- | :--- | :--- | :--- | :--- | :--- |
| **R-001** | **Data Leakage** | Insider threat or compromised credential leads to exfiltration of customer PII via bulk export. | **CRITICAL** (5x4) | 1. Strict RBAC & JIT Access<br>2. DLP on Egress Points<br>3. PII Redaction in Logs<br>4. User Behavior Analytics (UBA) | **LOW** | CISO | 🟢 Monitored |
| **R-002** | **App Security** | SQL Injection or RCE vulnerability in API allows attacker to gain shell access or dump DB. | **HIGH** (5x3) | 1. SAST/DAST in CI/CD (Blocking)<br>2. WAF blocking common payloads<br>3. RASP (Runtime Protection)<br>4. Bug Bounty Program | **LOW** | CTO | 🟢 Monitored |
| **R-003** | **Availability** | DDoS attack overwhelms API gateway, causing outage for legitimate users. | **HIGH** (4x4) | 1. Cloud-based DDoS Protection (CDN)<br>2. Rate Limiting (IP/User)<br>3. Auto-scaling Infrastructure | **MEDIUM** | VP Eng | 🟢 Monitored |
| **R-004** | **Supply Chain** | Compromised NPM package introduces malware/backdoor into production build. | **HIGH** (5x3) | 1. SCA Scanning (Snyk)<br>2. Dependabot Auto-updates<br>3. Provenance Signing (Cosign)<br>4. Vendor Risk Assessment | **LOW** | VP Eng | 🟡 In Progress |
| **R-005** | **Identity** | Credential stuffing attack compromises user accounts without MFA. | **HIGH** (4x5) | 1. Adaptive MFA (Step-up)<br>2. Breached Password Detection<br>3. Rate Limiting on Login | **LOW** | CISO | 🟢 Monitored |
| **R-006** | **Compliance** | Failure to adhere to GDPR/CCPA Data Subject Requests (Right to be Forgotten). | **MEDIUM** (3x3) | 1. Automated DSR Workflows<br>2. Data Mapping & Discovery<br>3. Privacy Policy Updates | **LOW** | Legal | 🟡 In Progress |

## Legend
- **Inherent Risk:** The risk level before controls are applied (Impact x Likelihood).
- **Residual Risk:** The remaining risk after controls are applied.
- **Status:** 🟢 Monitored (Within Tolerance), 🟡 In Progress (Mitigation Underway), 🔴 Critical (Exceeds Tolerance).
