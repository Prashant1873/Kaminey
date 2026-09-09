---
colors:
  primary: "#E5B869"
  primary-container: "#C99738"
  secondary: "#9E2A2B"
  secondary-container: "#540B0E"
  gain: "#10B981"
  gain-text: "#34D399"
  loss: "#EF4444"
  loss-text: "#F87171"
  warning: "#F59E0B"
  warning-text: "#FBBF24"
  simsim-neon: "#10B981"
  simsim-surface: "#07080B"
  simsim-header: "#040507"
  surface: "#090A0F"
  surface-container-lowest: "#0F1118"
  surface-container-low: "#151822"
  surface-container: "#1C202E"
  surface-container-high: "#24293B"
  surface-container-highest: "#2D3349"
  on-surface: "#F8FAFC"
  on-surface-variant: "#94A3B8"
  outline: "#475569"
  outline-variant: "rgba(255, 255, 255, 0.08)"
  black-oled: "#000000"
  dark-surface-card: "#080808"
  dark-border-subtle: "#141414"
typography:
  display:
    fontFamily: "-apple-system, BlinkMacSystemFont, 'SF Pro Display', 'Hanken Grotesk', system-ui, sans-serif"
    fontSize: "clamp(2rem, 5vw, 2.75rem)"
    fontWeight: 800
    lineHeight: 1.1
    letterSpacing: "-0.03em"
  headline:
    fontFamily: "-apple-system, BlinkMacSystemFont, 'SF Pro Display', 'Hanken Grotesk', system-ui, sans-serif"
    fontSize: "clamp(1.25rem, 3vw, 1.5rem)"
    fontWeight: 700
    lineHeight: 1.2
    letterSpacing: "-0.02em"
  title:
    fontFamily: "-apple-system, BlinkMacSystemFont, 'SF Pro Text', 'Hanken Grotesk', system-ui, sans-serif"
    fontSize: "1.125rem"
    fontWeight: 600
    lineHeight: 1.3
  body:
    fontFamily: "-apple-system, BlinkMacSystemFont, 'SF Pro Text', 'Hanken Grotesk', system-ui, sans-serif"
    fontSize: "0.9375rem"
    fontWeight: 400
    lineHeight: 1.5
  label:
    fontFamily: "-apple-system, BlinkMacSystemFont, 'SF Pro Text', 'Hanken Grotesk', system-ui, sans-serif"
    fontSize: "0.75rem"
    fontWeight: 700
    letterSpacing: "0.06em"
rounded:
  sm: "6px"
  md: "10px"
  lg: "14px"
  xl: "18px"
  2xl: "24px"
  full: "9999px"
spacing:
  xs: "4px"
  sm: "8px"
  md: "16px"
  lg: "24px"
  xl: "32px"
components:
  strategy-chip:
    backgroundColor: "{colors.surface-container-low}"
    textColor: "{colors.on-surface}"
    rounded: "{rounded.xl}"
    padding: "10px 16px"
  strategy-chip-active:
    backgroundColor: "{colors.primary}"
    textColor: "#0A0B0E"
    rounded: "{rounded.xl}"
    padding: "10px 16px"
  category-pill:
    backgroundColor: "transparent"
    textColor: "{colors.on-surface-variant}"
    rounded: "{rounded.full}"
    padding: "8px 16px"
  category-pill-active:
    backgroundColor: "{colors.primary}"
    textColor: "#0A0B0E"
    rounded: "{rounded.full}"
    padding: "8px 16px"
  card-interactive:
    backgroundColor: "{colors.surface-container-lowest}"
    textColor: "{colors.on-surface}"
    rounded: "{rounded.2xl}"
    padding: "24px"
---

# Kaminey - Apple Minimal Haveli Design System

A minimalist, high-craft dark mode experience inspired by Apple interface design and rich Indian palace murder mystery aesthetics.

## Principles
1. **Direct Response**: All interactive surfaces provide tactile feedback (`:active { transform: scale(0.97); }`).
2. **Zero Emojis**: Replaced by crisp monochrome and tinted SVG vector icons (`lucide-react`).
3. **Materials & Depth**: Apple-style translucent glass chrome with `backdrop-filter: blur(24px)` and subtle hairline borders (`1px solid rgba(255, 255, 255, 0.08)`).
4. **Living Room Scale**: TV-first readability for host screens with 3rem+ room code and enlarged QR code canvas.
