# TaskNova AI Brand Identity: Motion Guidelines
> **Version:** 2.0.0  
> **Status:** Single Source of Truth (SSOT)  
> **Classification:** Confidential / Internal Branding Matrix

This document defines the physics, durations, and principles of motion and animation across all TaskNova AI digital platforms. We utilize animation not as a decoration, but as an interactive guide that reinforces hierarchy and indicates system status.

---

## 1. Core Motion Principles

Our motion system is designed around four key constraints:

```
    ELEGANT                       FAST                          SMOOTH                        PURPOSEFUL
 ┌────────────────┐          ┌────────────────┐             ┌────────────────┐             ┌────────────────┐
 │ Organic Curves │          │ Quick Response │             │ Constant Frame │             │ Guides Focus   │
 │ No Bounce      │          │ 150ms - 300ms  │             │ 60fps Target   │             │ Non-Disruptive │
 └────────────────┘          └────────────────┘             └────────────────┘             └────────────────┘
```

### A. Elegant and Natural
We do not use erratic, robotic, or overly bouncy animations. Our motion curves mimic organic physics—accelerating smoothly from rest and decelerating gently into place.
*   **Action Rule:** Use custom cubic-bezier easing curves rather than default linear fades.

### B. Decisive and Fast
Slow animations make a UI feel sluggish. Because contributors complete fast 10-second micro-tasks, all transitions must complete in under 300ms. Interaction feedback must trigger instantly.
*   **Action Rule:** Keep hover transitions at `150ms` and screen/dialog transitions at `300ms` maximum.

### C. Continuous and Smooth
Animation must never cause stutter or dropped frames. All motion must be GPU-accelerated to maintain a solid 60fps.
*   **Action Rule:** Only animate properties that can be offloaded to the compositor (`transform`, `opacity`). Never animate properties that trigger document reflow (`height`, `width`, `top`, `margin`).

### D. Purposeful
Every animation must have a job. It should explain a spatial relationship (e.g., a card sliding into view from the side it was clicked), draw focus to a success trigger (e.g., a ledger balance pulsing once upon credit), or show system activity (e.g., a slow-spinning loader).

---

## 2. Animation Preset Standards

We use these standard easing curves and durations across React (via `framer-motion`/`motion/react`) and CSS (via Tailwind classes):

### A. Durations
*   **Hover / Interaction Feedback:** `150ms` (Instantaneous reaction).
*   **System Action (Saving / Sending / Syncing):** `200ms`.
*   **Modal / Dialog Entrance:** `300ms` (Elegant build-up).
*   **Route / Screen Transitions:** `300ms` (Buttery smooth exit and entry).

### B. Easing Curves
*   **Ease-Out (Entering elements):** `cubic-bezier(0.16, 1, 0.3, 1)` (Ultra-fast start, extremely long deceleration tail).
*   **Ease-In (Exiting elements):** `cubic-bezier(0.7, 0, 0.84, 0)` (Starts slow, accelerates out of viewport).
*   **Ease-In-Out (Continuous status indicators):** `cubic-bezier(0.65, 0, 0.35, 1)` (Perfect mathematical symmetry).

---

## 3. Screen and Component Transition Guidelines

### A. Route transitions
*   When a user clicks a sidebar or header link to change pages, the current viewport must smoothly fade out and slide down slightly ($2\text{px}$).
*   The new page must immediately fade in and slide up ($4\text{px}$) from bottom, utilizing our standard `Ease-Out` curve over `300ms`.
*   This visual "entrance" creates a spatial anchor, making the user feel like they are stepping into the workspace.

### B. Modal Dialogs
*   **Entrance:** Background overlay fades in over `200ms`. The central modal card scales up from $95\%$ to $100\%$ and fades in over `300ms` using the custom `Ease-Out` curve.
*   **Exit:** The modal card scales down to $98\%$ and fades out over `200ms`, followed by the background overlay fading out over `150ms`.

### C. Tab Toggling & Workspace Comparisons
*   When switching between Twin responses in the comparison sandbox, do not use abrupt hard-cuts. Use a micro-fade transition (`150ms`) with a tiny horizontal slide ($2\text{px}$) to indicate the switch of perspective.

### D. Ledger & Coin Counters
*   When coins are credited, the coin indicator must scale up slightly ($1.08\times$) and return to normal over `250ms`, paired with a brief, soft green glow. This micro-feedback loop reinforces task satisfaction and build-up of momentum.
