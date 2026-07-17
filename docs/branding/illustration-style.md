# TaskNova AI Brand Identity: Icon, Illustration & Photography Guidelines
> **Version:** 2.0.0  
> **Status:** Single Source of Truth (SSOT)  
> **Classification:** Confidential / Internal Branding Matrix

To preserve an elite, premium visual aesthetic across our web, mobile, and marketing channels, we establish strict guidelines for all non-typographic visual elements: icons, illustrations, and photography.

---

## 1. Icon System Guidelines
All icons used across the ecosystem **MUST** be imported from the `lucide-react` library. We do not support custom SVG icons, which degrade visual consistency.

```
   STROKE WIDTH                CORNER RADIUS                  ALIGNMENT
 ┌────────────────┐          ┌────────────────┐             ┌────────────────┐
 │ 1.5px / 2px    │          │ Semi-Rounded   │             │ Perfectly      │
 │ Clean Lineage  │          │ Smooth Rhythm  │             │ Center-Aligned │
 └────────────────┘          └────────────────┘             └────────────────┘
```

### Visual Specifications
*   **Stroke Weight:**
    *   **UI Components:** Default to a `2px` stroke weight for high legibility at standard sizes (`h-4 w-4`).
    *   **Display Hero Features:** Use a thin `1.5px` stroke weight on larger icons (`h-10 w-10`) to convey elegance and sophistication.
*   **Corner Radius:** All icons must utilize a soft, semi-rounded geometric termination. Avoid harsh 90-degree points or cartoonish circular capsules.
*   **Sizing Standards:**
    *   **Inline Context (Buttons, Labels):** `h-4 w-4` or `h-3.5 w-3.5` (max 16px).
    *   **Headers & Navigation Items:** `h-5 w-5` (20px).
    *   **Feature Card Launchers / Top Containers:** `h-10 w-10` with a supporting padded background container of `h-12 w-12`.
*   **Coloring & State Changes:**
    *   **Default State:** Soft slate-400 or zinc-500.
    *   **Hover State:** Smooth transition to brand-emerald (`brand-500`) or active indigo (`indigo-400`), accompanied by a subtle `scale-105` scale.
*   **Subtle Animation Triggers:**
    *   Use micro-animations only on interactive hover. For example, spinning the `Command` icon slowly (`6s` duration) or causing the `Sparkles` icon to pulse gently. Avoid erratic, high-speed flashing.

---

## 2. Illustration System Guidelines
Our illustration system is designed to convey **complex cognitive science and artificial intelligence alignment**. We strictly reject childish cartoon characters, hand-drawn squiggles, or unpolished doodles.

### Core Illustration Principles
*   **Abstract Over Literal:** Do not illustrate literal computers, robots, or brain drawings. Instead, use premium, abstract representations of nodes, grids, light beams, prisms, and neural paths.
*   **Human + AI Collaboration:** Illustrations should represent how human cognition aligns artificial weight vectors. Visually express this through organic curves overlapping geometric wireframes (paralleling our Logo philosophy).
*   **Vector Fidelity:** All illustrations must be clean, highly scalable SVGs with soft semi-transparent gradient overlays. 
*   **Color Matching:** Limit the color palette of illustrations to our brand colors: Slate grays, deep blacks, emerald greens, and soft indigo gradients.
*   **Positive Negative Space:** Ensure that illustrations utilize at least $45\%$ empty space to allow the layout to breathe, emphasizing a premium feel.

---

## 3. Photography System Guidelines
When photographic assets are used in marketing decks, business portals, or user profile areas, they must follow a cohesive, unified art direction.

### Aesthetic Specifications
*   **Lighting:** Use cinematic, natural-looking, high-contrast lighting. Prefer side-lit portraits with deep, soft shadows to create depth. Avoid bright, flat, corporate studio flash-bulbs.
*   **Background Environment:** Backgrounds must be clean, minimalist, and slightly out of focus (soft depth-of-field bokeh). Ideal environments are dark modern research labs, elegant architectural wood-and-glass structures, or plain dark slate backdrops.
*   **Subject Expressions:** Subjects (representing contributors and researchers) should look focused, calm, confident, and authentic. Avoid exaggerated, fake "corporate smiles" or staged finger-pointing.
*   **Composition:** Utilize the "Rule of Thirds" with generous breathing room. Center the main focus slightly off-axis to allow text to overlay cleanly on the negative areas of the photo.
*   **Color Treatment:** Apply a very subtle cool/slate-colored grade to the shadows of all photographs to align them with our Dark Cosmic theme.
