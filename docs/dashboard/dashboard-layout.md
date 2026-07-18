# Bento Grid Layout Engine

Our console dashboard employs a custom-designed, responsive Bento Grid structure optimized for desktop density and comfortable mobile touch actions.

## Grid Columns Partitioning

The layout uses Tailwind's mobile-first column spans:

```html
<div className="grid grid-cols-1 md:grid-cols-4 gap-4">
```

This guarantees:
- **Mobile devices**: Columns collapse elegantly into a 1-column list where every widget occupies 100% width.
- **Medium viewports (Tablets)**: `col-span-2` elements fit side-by-side.
- **Desktop screens**: Spans fit into a beautiful, dense 4-column mosaic layout.

## Dynamic Customization Mode

By activating **Arrange Bento** mode in the control bar:
1. Dashed indigo alignment borders wrap every widget.
2. Direct dimension cycling buttons allow instant shifting from `SMALL` -> `MEDIUM` -> `LARGE` -> `FULL`.
3. Hide toggle buttons allow removing low-priority widgets on the fly.
4. Position maps sync automatically to the client's local persistent storage block under key `tasknova_widget_configs`.
