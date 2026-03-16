# A11y Demo

Side-by-side examples of 10 common WCAG 2.1 failures and their correct implementations. Each demo is interactive — try them with a keyboard or screen reader.

## Demos

| # | Topic | WCAG SC |
|---|-------|---------|
| 01 | Color Contrast | 1.4.3 |
| 02 | Alt Text | 1.1.1 |
| 03 | Form Labels | 1.3.1 |
| 04 | Focus Visibility | 2.4.7 |
| 05 | Heading Structure | 1.3.1 |
| 06 | Button Semantics | 4.1.2 |
| 07 | Modal Focus Trap | 2.1.2 |
| 08 | Live Regions | 4.1.3 |
| 09 | Skip Link | 2.4.1 |
| 10 | Reduced Motion | 2.3.3 |

## Stack

No frameworks. No build step.

- Vanilla HTML, CSS, and JavaScript (ES modules)
- CSS custom properties for theming (light/dark mode)
- `IntersectionObserver` for scroll-based nav highlighting and lazy demo initialization
- Deployed on Netlify

## Project structure

```
accessibility-demo/
├── index.html
├── css/
│   ├── tokens.css       # Design tokens (colors, spacing, type)
│   ├── reset.css
│   ├── base.css         # Element defaults
│   ├── layout.css       # Page shell, header, sidebar nav, hero
│   ├── components.css   # Demo panels, badges, forms, modals, etc.
│   └── utilities.css
└── js/
    ├── main.js          # Entry point, theme toggle, nav highlight
    ├── demo-toggle.js   # Broken/fixed tab switching per section
    ├── focus-trap.js    # Focus trap utility (used in modal demo)
    └── demos/           # One module per demo, lazy-loaded on scroll
```

## Accessibility features

- Skip to main content link
- Keyboard-navigable throughout
- ARIA roles, labels, and live regions where appropriate
- Dark/light theme toggle (persisted via `localStorage`, respects `prefers-color-scheme`)
- `prefers-reduced-motion` respected
- WCAG 2.1 AA compliant
