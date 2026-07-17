# TaskNova AI Brand Identity: Color Philosophy
> **Version:** 2.0.0  
> **Status:** Single Source of Truth (SSOT)  
> **Classification:** Confidential / Internal Branding Matrix

This document provides a comprehensive breakdown of our platform's color palette, explaining the cognitive psychology, usability purposes, and alignment behind our color choices.

---

## 1. Core Palette Breakdown

Our palette is designed around three functional layers: the **Canvas Layer** (for background focus), the **Verification Layer** (for brand trust), and the **Energy Layer** (for interactive accents).

```
   CANVAS LAYER               VERIFICATION LAYER             ENERGY LAYER
 ┌────────────────┐          ┌────────────────┐             ┌────────────────┐
 │ Slate-50       │          │ Brand-500      │             │ Indigo &       │
 │ Deep Twilight  │          │ Emerald Green  │             │ Purple Glow    │
 │ Focus Base     │          │ Trust & SLA    │             │ Active Action  │
 └────────────────┘          └────────────────┘             └────────────────┘
```

---

## 2. Palette Definitions & Values

### A. The Canvas Layer (Sleek Slate Matrix)
Instead of pure, harsh blacks or plain flat grays, we utilize a custom **Sleek Slate** scale that is inverted in dark mode to create a sophisticated twilight background:

| Color Token | Hex Value | Core Function |
| :--- | :--- | :--- |
| `slate-50` | `#0a0a0c` | Default Dark Canvas Background (reduces eye fatigue) |
| `slate-100` | `#131316` | Panel Backgrounds & Primary Card Containers |
| `slate-200` | `#1d1d22` | Borders, Unselected Tabs, Divider Lines |
| `slate-300` | `#2a2a32` | Secondary Inputs & Neutral Button Hover States |
| `slate-400` | `#52525b` | Unselected Tab Text, Muted Descriptions |
| `slate-500` | `#71717a` | Supporting Labels, Secondary Copy |
| `slate-600` | `#a1a1aa` | Standard Body Copy in Dark Mode |
| `slate-900` | `#f4f4f5` | Heading Titles, High-Contrast Text |

**Psychology:** Represents space, cosmic focus, and high-performance developer tools (like GitHub, Linear, or Vercel). It allows the actual content—the model evaluations—to remain the absolute focal point of the viewport.

---

### B. The Verification Layer (SLA Green / Emerald)
As a platform focused on **precision, validation, and consensus**, our primary brand indicator is a rich, organic green:

| Color Token | Hex Value | Core Function |
| :--- | :--- | :--- |
| `brand-50` | `#f0fdf4` | Light Mode success highlights and verified alerts |
| `brand-500` | `#10b981` | Core Brand / High SLA indicator (99%+ accuracy) |
| `brand-600` | `#059669` | Interactive success actions and active submission statuses |
| `brand-900` | `#064e3b` | Dark Mode premium success badges and safe status backing |

**Psychology:** Represents accuracy, verification, successful ledger transactions, and compliance. It builds confidence in contributors that their effort is recorded, and in researchers that their datasets are pure and clean.

---

### C. The Energy Layer (Interactive Cosmic Accent)
To create moments of premium quality, we use an active dual-color **Indigo-to-Violet** gradient:

| Color Token / Accent | Hex Value / Range | Core Function |
| :--- | :--- | :--- |
| **Indigo Glow** | `#6366f1` | Primary Call-to-Action background, active text highlights |
| **Purple Aura** | `#8b5cf6` | Ambient gradient blends, future-feature indicators |
| **Rose/Pink Accent** | `#ec4899` | Subtle micro-accents, terminal-run highlights |

**Psychology:** Represents intelligence, cutting-edge artificial networks, and future technology. Used in moderation, it guides the eye to important pathways (like Launching the Sandbox) without cluttering the screen or overwhelming the user's focus.

---

## 3. Accessibility & Usability Protocols
*   **Contrast Targets:** All text elements on Slate-50 backgrounds must exceed the WCAG 2.1 AA threshold of **4.5:1** for normal text and **3:1** for large text.
*   **Color as Status Helper:** Color is **never** the sole indicator of status or error. All state changes, warning messages, and button actions must be accompanied by a semantic icon (e.g., `CheckCircle2` for successes, `ShieldAlert` for issues) or descriptive text.
*   **Dark Mode Optimization:** When rendering on ultra-dark slate, bright colors are slightly desaturated to prevent "vibrational blurring" on OLED displays.
