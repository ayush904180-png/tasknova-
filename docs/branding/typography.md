# TaskNova AI Brand Identity: Typography Guidelines
> **Version:** 2.0.0  
> **Status:** Single Source of Truth (SSOT)  
> **Classification:** Confidential / Internal Branding Matrix

Typography is the cornerstone of our visual design system. Because our users are either evaluating high-density text outputs from AI models or reading technical specifications, our typographical choices prioritizes legibility, rhythmic variation, and visual elegance.

---

## 1. Font Selection Strategy & Pairings

We utilize a three-tiered font pairing system, matching visual "vibes" with explicit functional duties:

```
  SPACE GROTESK                INTER                       JETBRAINS MONO
 ┌────────────────┐          ┌────────────────┐             ┌────────────────┐
 │ Display / Title│          │ Body / UI Text │             │ Technical Data │
 │ Tech-Forward   │          │ High-Contrast  │             │ Code & Status  │
 └────────────────┘          └────────────────┘             └────────────────┘
```

---

## 2. Typography Hierarchy

### A. Display & Headings: Space Grotesk
*   **Vibe:** Tech-forward, geometric, Swiss-modern, and confident.
*   **Role:** Used exclusively for large headers, section titles, and display statistics where impact and structure are required.
*   **Usage Guidelines:** 
    *   Set with a tight letter-spacing (`tracking-tight`) to keep characters unified.
    *   Set to `font-bold` or `font-medium` to establish strong visual hierarchy.

### B. Body & General UI Text: Inter
*   **Vibe:** Highly versatile, clean, modern, and exceptionally legible at small sizes.
*   **Role:** Used for all paragraph text, input labels, dashboard tables, lists, buttons, and FAQs.
*   **Usage Guidelines:**
    *   Standard body text is set with a relaxed line-height (`leading-relaxed`) to prevent vertical crowding.
    *   Paragraph weight is set to `font-light` (`300`) or `font-normal` (`400`) in dark mode to prevent visual thickness, and `font-normal` (`400`) in light mode.

### C. Technical Data & System Indicators: JetBrains Mono
*   **Vibe:** Precise, structured, engineering-grade, and diagnostic.
*   **Role:** Used for ledger transactions, accuracy SLA percentages, coin counters, task IDs, and code blocks.
*   **Usage Guidelines:**
    *   Set to `text-xs` or `text-[10px]` with uppercase tracking (`tracking-wider` or `tracking-widest`).
    *   Always paired with a supporting icon to emphasize its systemic/diagnostic role.

---

## 3. Typographical Styles Cheat Sheet

| Category | Font Family | Tailwind Utility Classes | Ideal Use Case |
| :--- | :--- | :--- | :--- |
| **Hero Title** | Space Grotesk | `font-display text-5xl md:text-7xl font-bold tracking-tight text-white` | Primary landing page headlines |
| **Section Title** | Space Grotesk | `font-display text-3xl sm:text-4xl font-bold tracking-tight text-white` | Header tags, section divisions |
| **Card Title** | Space Grotesk | `font-display text-base font-bold text-white` | Feature card titles, task lists |
| **Body Paragraph** | Inter | `font-sans text-xs sm:text-sm text-slate-600 dark:text-zinc-400 font-light leading-relaxed` | Descriptions, support articles |
| **Button Label** | Inter | `font-sans text-xs sm:text-sm font-semibold tracking-wide uppercase` | Buttons, navigation triggers |
| **Ledger Token** | JetBrains Mono | `font-mono text-xs text-emerald-400 font-bold tabular-nums` | Coin values, reward totals |
| **Telemetry Tag** | JetBrains Mono | `font-mono text-[9px] uppercase tracking-widest text-slate-500` | Task IDs, system status labels |

---

## 4. Accessibility & Legibility Directives
1.  **Tabular Numbers:** For any layout rendering numeric sequences (e.g., wallet balances, ledger records, telemetry lists), you must apply `tabular-nums` from Tailwind. This prevents numbers from shifting horizontally as the value updates, ensuring a stable visual alignment.
2.  **Explicit Line Heights:** Never leave paragraphs with a default browser line height. Always apply `leading-normal` or `leading-relaxed` to prevent text lines from bleeding together.
3.  **Letter Spacing Alignment:** As font size increases, letter-spacing must decrease. For titles ($>24\text{px}$), apply `tracking-tight`. For small microcopy ($<11\text{px}$), apply `tracking-wider` or `tracking-widest` to preserve legibility.
4.  **No Pure Gray Text on Muted Backdrops:** Ensure all supporting text maintains a contrast ratio of at least 4.5:1. Never use raw `#555` or `#666` text over slate-100 dark backgrounds.
