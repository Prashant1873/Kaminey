---
colors:
  primary: "#003d9b"
  primary-container: "#0052cc"
  secondary: "#285ab9"
  secondary-container: "#709bfe"
  gain: "#36B37E"
  gain-text: "#00875A"
  loss: "#FF5630"
  loss-text: "#DE350B"
  warning: "#FF9F0A"
  warning-text: "#B76E00"
  simsim-neon: "#00F090"
  simsim-surface: "#0B0F19"
  simsim-header: "#070A12"
  surface: "#f8f9fb"
  surface-container-lowest: "#ffffff"
  surface-container-low: "#f3f4f6"
  surface-container: "#edeef0"
  surface-container-high: "#e7e8ea"
  surface-container-highest: "#e1e2e4"
  on-surface: "#191c1e"
  on-surface-variant: "#434654"
  outline: "#737685"
  outline-variant: "#c3c6d6"
typography:
  display:
    fontFamily: "Hanken Grotesk, system-ui, sans-serif"
    fontSize: "clamp(1.875rem, 4vw, 2.25rem)"
    fontWeight: 800
    lineHeight: 1.15
  headline:
    fontFamily: "Hanken Grotesk, system-ui, sans-serif"
    fontSize: "1.375rem"
    fontWeight: 700
    lineHeight: 1.2
  title:
    fontFamily: "Hanken Grotesk, system-ui, sans-serif"
    fontSize: "1.125rem"
    fontWeight: 600
    lineHeight: 1.3
  body:
    fontFamily: "Hanken Grotesk, system-ui, sans-serif"
    fontSize: "0.9375rem"
    fontWeight: 400
    lineHeight: 1.45
  label:
    fontFamily: "Hanken Grotesk, system-ui, sans-serif"
    fontSize: "0.75rem"
    fontWeight: 700
    letterSpacing: "0.04em"
rounded:
  sm: "4px"
  md: "8px"
  lg: "12px"
  xl: "16px"
  2xl: "20px"
  full: "9999px"
spacing:
  xs: "4px"
  sm: "8px"
  md: "16px"
  lg: "24px"
  xl: "32px"
components:
  strategy-chip:
    backgroundColor: "{colors.surface-container-lowest}"
    textColor: "{colors.on-surface}"
    rounded: "{rounded.xl}"
    padding: "10px 16px"
  strategy-chip-active:
    backgroundColor: "{colors.primary-container}"
    textColor: "{colors.surface-container-lowest}"
    rounded: "{rounded.xl}"
    padding: "10px 16px"
  category-pill:
    backgroundColor: "transparent"
    textColor: "{colors.on-surface-variant}"
    rounded: "{rounded.lg}"
    padding: "8px 12px"
  category-pill-active:
    backgroundColor: "{colors.primary-container}"
    textColor: "{colors.surface-container-lowest}"
    rounded: "{rounded.lg}"
    padding: "8px 12px"
  card-interactive:
    backgroundColor: "{colors.surface-container-lowest}"
    textColor: "{colors.on-surface}"
    rounded: "{rounded.2xl}"
    padding: "20px"
  view-toggle-btn:
    backgroundColor: "transparent"
    textColor: "{colors.on-surface-variant}"
    rounded: "{rounded.full}"
    padding: "6px 14px"
  view-toggle-btn-active:
    backgroundColor: "{colors.surface-container-lowest}"
    textColor: "{colors.primary}"
    rounded: "{rounded.full}"
    padding: "6px 14px"
---

### Neutral
- **Observatory Cool Surface** (`#f8f9fb`): Base canvas background.
- **Pure White Container** (`#ffffff`): Card background surfaces, active toggle thumbs, and dropdown menus.
- **Soft Slate Container** (`#f3f4f6`): Secondary container background and inactive input fields.
- **Deep Charcoal Text** (`#191c1e`): Primary body text and numerical figures.
- **Slate Variant Text** (`#434654`): Secondary captions, table headers, and metadata labels.
- **Cool Border Grey** (`#737685`): Outlines, input borders, and table gridlines.


## Typography

**Display Font:** Hanken Grotesk (fallback: system-ui, sans-serif)  
**Body Font:** Hanken Grotesk (fallback: system-ui, sans-serif)  
**Label/Mono Font:** Hanken Grotesk with `tabular-nums` (`"tnum" 1`)

**Character:** Clean, highly legible geometric sans-serif engineered for financial clarity, with explicit tabular figure alignment for jitter-free multi-column metric comparisons.

### Hierarchy
- **Display** (800 weight, `clamp(1.875rem, 4vw, 2.25rem)`, line-height 1.15): Used for main page titles, hero metrics, and SimSim score callouts.
- **Headline** (700 weight, 1.375rem / 22px, line-height 1.2): Section headers, drawer titles, and modal headers.
- **Title** (600 weight, 1.125rem / 18px, line-height 1.3): Card titles, fund scheme names, and accordion titles.
- **Body** (400/500 weight, 0.9375rem / 15px, line-height 1.45): Primary analytical copy, fund descriptions, and method disclosures.
- **Label** (700 weight, 0.75rem / 12px, letter-spacing 0.04em, uppercase/semi-bold): Table headers, category badges, metric labels, and pillar tags.


## Layout

The spatial model uses an edge-to-edge full-viewport app shell (`app-shell`) with a collapsible 320px fluid sidebar on the left and a scrollable main content stage. 

- **Grid & Rhythm:** Standard 8px spatial grid (`xs: 4px`, `sm: 8px`, `md: 16px`, `lg: 24px`, `xl: 32px`).
- **Responsive Behavior:** 
  - Desktop ($\ge 1024\text{px}$): Dual-pane split with persistent collapsible sidebar and multi-column grid (2-3 fund cards per row).
  - Tablet/Mobile ($< 1024\text{px}$): Sidebar collapses into an overlay drawer; card grids stack vertically in single-column layout.
- **Container Strategy:** Maximum content width capped at `1400px` for optimal eye-scan lines.


### Shadow Vocabulary
- **Resting Card Shadow** (`box-shadow: 0px 4px 12px rgba(9, 30, 66, 0.08)`): Resting state for interactive cards and strategy chips.
- **Elevated Hover Shadow** (`box-shadow: 0px 16px 36px -6px rgba(9, 30, 66, 0.12)`): Hover state for interactive fund cards (`card-interactive`).
- **Floating Dock Shadow** (`box-shadow: 0px 16px 40px rgba(9, 30, 66, 0.16)`): Persistent bottom comparison bar and SimSim floating drawer.

### Named Rules
**The Tactile Spring Rule.** Every interactive element must respond instantly to pointer-down (`:active`) events with a quick scale compression (`transform: scale(0.97)`) using Apple-tuned spring timing (`cubic-bezier(0.2, 0.8, 0.2, 1)`).

## Shapes

Form language is characterized by smooth squircle corner curvatures and clean borders.

- **Chips & Badges:** `14px` radius squircle border (`rounded-xl`).
- **Interactive Cards:** `20px` radius container curvature (`rounded-2xl`).
- **Category Pills & View Switchers:** Smooth pill curvature (`rounded-full` / `9999px`).
- **Inputs & Dropdowns:** `12px` rounded border (`rounded-lg`) with `1px` subtle outline (`rgba(9, 30, 66, 0.12)`).

## Components

### Strategy Chips
- **Shape:** Gently curved squircle (`14px` radius).
- **Primary Style:** White surface (`#ffffff`), `1px` subtle border, inline radiant gradient emblem (`chip-emblem`).
- **Active State:** Linear gradient background (`#0052cc` to `#00368c`), white text, cobalt glow shadow (`0 8px 24px -3px rgba(0, 82, 204, 0.35)`).
- **Hover/Active:** `translateY(-2px)` lift on hover; `scale(0.97)` squeeze on active click.

### Interactive Cards
- **Corner Style:** `20px` radius squircle (`rounded-2xl`).
- **Background:** White glass surface (`#ffffff`) with subtle `1px` border (`rgba(9, 30, 66, 0.08)`).
- **Hover Treatment:** `translateY(-3px)` subtle lift, border glow (`rgba(0, 82, 204, 0.22)`), and expanded ambient drop shadow.
