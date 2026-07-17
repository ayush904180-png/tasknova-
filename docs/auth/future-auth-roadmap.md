# Post-MVP Authentication Roadmap

The authentication architecture has been designed with extension points to support complex, high-security login protocols in future platform updates.

---

## 1. Phone OTP (Sms Gateway)
* **Integration**: Firebase Phone Provider integrated with Twilio SMS dispatchers.
* **Target Audience**: High-intensity global evaluation grids requiring SIM-card bound validation parameters.

---

## 2. FIDO2 Passkeys (WebAuthn)
* **Integration**: Apple TouchID, Windows Hello, and Android Biometric credential mappings on-device.
* **Target Audience**: Enterprise admin logs and high-volume coin ledger audits.

---

## 3. Passwordless Magic Links
* **Integration**: Dispatch dynamic secure login hashes straight to inboxes.
* **Target Audience**: Quick contributor onboarding experiences without password friction.

---

## 4. Federated Identity (Apple / GitHub)
* **Integration**: Add GitHub and Apple Developer OAuth credentials.
* **Target Audience**: Technical validators (GitHub) and mobile iOS platform integrations (Apple).
