# Telemetry Analytics Events

TaskNova tracks standard user interface behaviors inside the profile module to analyze user retention, setting preferences, and badge completion milestones.

## Event Specifications

Telemetry events are typed inside `/src/profile/analytics/index.ts`. Below is a breakdown of active event schemas:

### 1. `PROFILE_VIEWED`
Fires when the profile component mounts or when a user inspects another node.
- **Payload fields**:
  - `uid`: Target profile node UID.
  - `source`: The visual navigation trigger (e.g., `profile_view_mount`, `leaderboard_click`).

### 2. `PROFILE_UPDATED`
Fires when a user saves changes to their biography or display fields.
- **Payload fields**:
  - `uid`: Target profile node UID.
  - `fieldsChanged`: Array listing modified fields (e.g., `['displayName', 'bio']`).

### 3. `AVATAR_CHANGED`
Fires when a user selects a different gradient visual preset.
- **Payload fields**:
  - `uid`: Target profile node UID.
  - `style`: The gradient background string identifier.

### 4. `BADGE_EARNED`
Fires when a user qualifies for a credential.
- **Payload fields**:
  - `uid`: User node UID.
  - `badgeId`: Qualified badge identifier string.
  - `label`: Friendly badge label.

### 5. `LANGUAGE_CHANGED`
Fires when language preference triggers a localization update.
- **Payload fields**:
  - `uid`: User node UID.
  - `previous`: Language code before change.
  - `next`: Selected language code.

### 6. `SECURITY_SETTINGS_OPENED`
Fires when auditing credentials or toggling session controls.
- **Payload fields**:
  - `uid`: User node UID.
  - `screen`: Specific sub-panel inspected.
