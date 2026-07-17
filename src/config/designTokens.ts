/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

/**
 * TaskNova AI Global Design Tokens (SaaS Enterprise Grade)
 * This file serves as the Single Source of Truth (SSoT) for design specs,
 * enabling programmatic style consistency and future-proof scaling.
 */

export const DESIGN_TOKENS = {
  theme: {
    modes: ['light', 'dark'] as const,
    default: 'dark' as const,
  },

  // 2. Semantic Color Palette
  colors: {
    brand: {
      indigo: {
        50: '#f5f3ff',
        100: '#ede9fe',
        500: '#6366f1',
        600: '#4f46e5',
        700: '#4338ca',
      },
      purple: {
        500: '#a855f7',
        600: '#9333ea',
      },
      pink: {
        500: '#ec4899',
      }
    },
    semantic: {
      primary: {
        light: '#0f172a', // deep slate
        dark: '#f4f4f5',  // zinc 100
      },
      secondary: {
        light: '#475569', // slate 600
        dark: '#a1a1aa',  // zinc 400
      },
      accent: {
        light: '#4f46e5', // indigo 600
        dark: '#6366f1',  // indigo 500
      },
      success: {
        light: '#16a34a', // green 600
        dark: '#10b981',  // brand-500 emerald
      },
      warning: {
        light: '#d97706', // amber 600
        dark: '#f59e0b',  // amber 500
      },
      danger: {
        light: '#dc2626', // red 600
        dark: '#f43f5e',  // rose 500
      },
      info: {
        light: '#2563eb', // blue 600
        dark: '#60a5fa',  // blue 400
      },
      background: {
        light: '#f8fafc', // slate 50
        dark: '#030303',  // pure dark pitch
      },
      surface: {
        light: '#ffffff', // pure white
        dark: '#09090b',  // zinc 950 obsidian
      },
      border: {
        light: '#e2e8f0', // slate 200
        dark: 'rgba(255, 255, 255, 0.05)', // ultra-subtle transparent border
      },
      mutedText: {
        light: '#64748b', // slate 500
        dark: '#71717a',  // zinc 500
      },
      hover: {
        light: 'rgba(0, 0, 0, 0.02)',
        dark: 'rgba(255, 255, 255, 0.05)',
      },
      disabled: {
        light: '#cbd5e1', // slate 300
        dark: '#27272a',  // zinc 800
      },
      focus: {
        light: '#4f46e5',
        dark: '#6366f1',
      }
    }
  },

  // 3. Typography Hierarchy
  typography: {
    fontFamilies: {
      sans: '"Inter", ui-sans-serif, system-ui, sans-serif',
      display: '"Space Grotesk", sans-serif',
      mono: '"JetBrains Mono", ui-monospace, monospace',
    },
    sizes: {
      h1: { fontSize: '4.5rem', lineHeight: '1.05', letterSpacing: '-0.03em', fontWeight: '700' }, // Hero size
      h2: { fontSize: '1.875rem', lineHeight: '1.2', letterSpacing: '-0.02em', fontWeight: '700' }, // Section title
      h3: { fontSize: '1.5rem', lineHeight: '1.25', letterSpacing: '-0.01em', fontWeight: '600' },  // Sub-section
      h4: { fontSize: '1.25rem', lineHeight: '1.3', letterSpacing: '0', fontWeight: '600' },        // Card header
      bodyLarge: { fontSize: '1.125rem', lineHeight: '1.5', letterSpacing: '0', fontWeight: '400' },
      bodyMedium: { fontSize: '0.875rem', lineHeight: '1.5', letterSpacing: '0', fontWeight: '400' },
      bodySmall: { fontSize: '0.75rem', lineHeight: '1.4', letterSpacing: '0.01em', fontWeight: '400' },
      caption: { fontSize: '0.6875rem', lineHeight: '1.4', letterSpacing: '0.03em', fontWeight: '500' },
      buttonText: { fontSize: '0.875rem', lineHeight: '1', letterSpacing: '0.01em', fontWeight: '600' },
      labelText: { fontSize: '0.75rem', lineHeight: '1', letterSpacing: '0.02em', fontWeight: '500' },
    }
  },

  // 4. Spacing Scale (8-Point Grid Compliant)
  spacing: {
    '4px': '0.25rem',    // micro padding, gap spacing
    '8px': '0.5rem',     // items gap, small padding
    '12px': '0.75rem',   // content lists gap
    '16px': '1rem',      // standard padding, spacing
    '20px': '1.25rem',   // standard density gap
    '24px': '1.5rem',    // card padding
    '32px': '2rem',      // layout grids
    '40px': '2.5rem',    // container section gaps
    '48px': '3rem',      // massive spacing
    '64px': '4rem',      // hero margin gaps
    '80px': '5rem',
    '96px': '6rem',
  },

  // 5. Border Radius System
  borderRadius: {
    small: '0.375rem',   // 6px - buttons, badges, small tag blocks
    medium: '0.5rem',    // 8px - standard items, dropdown rails
    large: '0.75rem',    // 12px - cards, code panels
    xl: '1.5rem',        // 24px - outer hero dialogs, pricing bentoes
    button: '0.5rem',    // standard buttons
    input: '0.5rem',     // form inputs
    dialog: '1.5rem',    // modals & overlays
  },

  // 6. Shadow System
  shadows: {
    light: {
      soft: '0 1px 3px rgba(0,0,0,0.05), 0 1px 2px rgba(0,0,0,0.03)',
      medium: '0 4px 6px -1px rgba(0,0,0,0.06), 0 2px 4px -1px rgba(0,0,0,0.03)',
      strong: '0 10px 15px -3px rgba(0,0,0,0.08), 0 4px 6px -2px rgba(0,0,0,0.04)',
      floating: '0 20px 25px -5px rgba(0,0,0,0.1), 0 10px 10px -5px rgba(0,0,0,0.04)',
      modal: '0 25px 50px -12px rgba(0,0,0,0.15)',
    },
    dark: {
      soft: '0 1px 3px rgba(0,0,0,0.4), 0 1px 2px rgba(0,0,0,0.3)',
      medium: '0 4px 12px rgba(0,0,0,0.5), 0 2px 6px rgba(0,0,0,0.3)',
      strong: '0 12px 24px rgba(0,0,0,0.6), 0 4px 12px rgba(0,0,0,0.4)',
      floating: '0 20px 40px rgba(0,0,0,0.7), 0 8px 16px rgba(0,0,0,0.5)',
      modal: '0 24px 64px rgba(0,0,0,0.8)',
    }
  },

  // 14. Framer Motion Animation Presets (Import from motion/react)
  animations: {
    transition: {
      ease: [0.16, 1, 0.3, 1], // premium custom cubic-bezier
      duration: 0.35,
    },
    hover: {
      scale: 1.02,
      transition: { duration: 0.2, ease: 'easeOut' },
    },
    tap: {
      scale: 0.98,
    },
    fadeIn: {
      initial: { opacity: 0, y: 10 },
      animate: { opacity: 1, y: 0 },
      transition: { duration: 0.3, ease: 'easeOut' },
    }
  },

  // 15. Responsive Boundaries (Standard Tailwind breakpoints)
  responsive: {
    mobile: 'max-width: 639px',
    tablet: 'min-width: 640px',
    laptop: 'min-width: 1024px',
    desktop: 'min-width: 1280px',
    ultrawide: 'min-width: 1536px',
  },

  // 16. Accessibility Commitments (WCAG 2.1 AA)
  accessibility: {
    minimumContrastRatio: '4.5:1', // For text below 18pt
    focusRingWidth: '2px',
    focusRingColor: '#6366f1',
    keyboardNavigableElements: ['button', 'input', 'select', 'textarea', 'a', '[tabindex="0"]'],
  }
};
