# TaskNova AI Onboarding Foundation

Welcome to the TaskNova AI User Onboarding Foundation specifications. This module governs the post-authentication staging experience, preparing the user node with proper roles, compliance signatures, custom settings, and skill catalogs before granting full dashboard/sandbox credentials.

## Core Architectural Design

The onboarding journey is structured as a single-page wizard with zero unneeded server dependencies, leveraging safe storage mock boundaries to insulate the client-side experience until explicit Firestore synchronization is configured.

```
+---------------------------------------------------------+
|                  Onboarding Shell                       |
+---------------------------------------------------------+
| [Bypass Mode]                                           |
| [Step Indicators]                                       |
|                                                         |
|  +---------------------------------------------------+  |
|  |             Active Step Screen Component          |  |
|  |  (Welcome, Role, Terms, Verification, Profile...) |  |
|  +---------------------------------------------------+  |
|                                                         |
| [Back]                                [Save & Continue] |
+---------------------------------------------------------+
```

## Folder Structure

All assets, components, and configurations reside under localized paths:
- `/src/onboarding/types/index.ts` - Strongly typed models and steps definitions.
- `/src/onboarding/constants/index.ts` - Localized configurations for languages, countries, timezones, interests, and roles.
- `/src/onboarding/mocks/index.ts` - Abstract repository mocking persistent memory saves and detailing database mapping blueprint structures.
- `/src/onboarding/components/` - Step-specific UI elements engineered with standard WCAG AA guidelines.

## Layout Styling

Aligns perfectly with the TaskNova global theme:
- Slate-Dark canvas background with clean indigo accents.
- Responsive, high-contrast typography using Inter.
- Interactive, tactile visual states for selectable cards and toggles.
