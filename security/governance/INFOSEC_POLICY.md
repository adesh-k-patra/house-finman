# Information Security Policy (ISP) - Master Document

**Policy Version:** 1.0
**Effective Date:** 2026-02-08
**Classification:** Internal

## 1. Introduction
This policy outlines the mandatory security controls and standards for HouseFin Man. Non-compliance may result in disciplinary action.

## 2. Access Control Policy
*   **Principle of Least Privilege:** Users must only be granted the minimum access necessary to perform their job function.
*   **MFA Mandate:** Multi-Factor Authentication (MFA) is **mandatory** for:
    *   All remote access (VPN, Cloud Console).
    *   All administrative accounts.
    *   All access to customer data.
*   **Password Standards:**
    *   Minimum length: 12 characters.
    *   Complexity: Alphanumeric + Special.
    *   Rotation: 90 days (unless MFA is enforced + rotation carries risk). Passphrases preferred.
*   **Review:** Access rights must be reviewed quarterly by managers.

## 3. Cryptography & Key Management
*   **Data at Rest:** All sensitive data (PII, Financial) must be encrypted using AES-256 or equivalent.
*   **Data in Transit:** All network communication must use TLS 1.2 or higher (TLS 1.3 preferred).
*   **Key Management:** Encryption keys must be managed in a secure KMS/HSM. Keys must be rotated annually.
*   **Secrets:** No hardcoded secrets in source code. Use Vault or Environment Variables.

## 4. Application Security
*   **SDLC:** Security must be integrated into the development lifecycle.
*   **Code Review:** All code changes must be peer-reviewed and scanned for vulnerabilities (SAST) before deployment.
*   **Input Validation:** All user input must be validated and sanitized.
*   **Output Encoding:** All user-generated content must be encoded to prevent XSS.

## 5. Incident Response
*   **Reporting:** All suspected security incidents must be reported immediately to `security@housefinman.com`.
*   **Response Team:** The SIRT (Security Incident Response Team) has authority to isolate systems during an active incident.
*   **Post-Mortem:** A blameless post-mortem is required for all Severity 1 & 2 incidents.

## 6. Acceptable Use
*   **Devices:** Only company-approved devices may access production environments.
*   **Data Handling:** Customer data must never be stored on personal devices or unapproved cloud storage (e.g., personal Google Drive).

## 7. Third-Party Risk
*   **Assessment:** all new vendors must undergo a security risk assessment before contract signing.
*   **Access:** Vendors must only access systems via secure, monitored channels (e.g., VPN with MFA).

---
**Enforcement:** The CISO is responsible for monitoring compliance with this policy. Exceptions must be formally approved via the Risk Acceptance workflow.
