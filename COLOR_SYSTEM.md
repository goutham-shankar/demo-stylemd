# Color & Design System Reference

## CSS Variables (`:root` in globals.css)

### Surfaces & Neutrals
- `--paper`: `#f8f7f5` – Light background for secondary sections
- `--paper-strong`: `#f2efe9` – Slightly darker paper
- `--surface`: `#ffffff` – Primary white surface (cards, modals)
- `--surface-soft`: `#f7f4ee` – Soft hover/focus background
- `--bg-page`: `#f6f8fa` – Main page background

### Text Colors
- `--text-primary`: `#111111` – Primary heading/body text
- `--text-secondary`: `#616161` – Secondary text (paragraphs, descriptions)
- `--text-tertiary`: `#6b6761` – Tertiary text (captions, small labels)
- `--text-muted`: `#7a756f` – Muted text (disabled, inactive)
- `--muted`: `#5f5b56` – Legacy muted (use --text-muted)
- `--ink`: `#0d0d0d` – Dark ink (fallback primary)

### Borders & Dividers
- `--border-light`: `rgba(0, 0, 0, 0.05)` – Subtle borders
- `--border-medium`: `rgba(0, 0, 0, 0.08)` – Default borders
- `--border-dark`: `rgba(0, 0, 0, 0.15)` – Emphasis borders
- `--line`: `rgba(13, 13, 13, 0.08)` – Legacy border (use --border-medium)

### CTAs & Actions
- `--cta`: `#007356` – Primary CTA green (buttons, links)

### Accent Colors
- `--accent-blue`: `#3b82f6` – Blue accent
- `--accent-blue-light`: `#0a73eb` – Bright blue (tags)
- `--accent-cyan`: `#36c5f0` – Cyan accent
- `--accent-green`: `#4ade80` – Green accent
- `--accent-orange`: `#f59e0b` – Orange accent
- `--accent-purple`: `#7c3aed` – Purple accent
- `--accent-pink`: `#ec4899` – Pink accent

---

## Utility Classes

### Text Color Utilities
- `.text-primary` – Use for headings and primary text
- `.text-secondary` – Use for body descriptions and secondary content
- `.text-tertiary` – Use for captions and small text
- `.text-muted` – Use for disabled, inactive, or tertiary navigation

### Background Color Utilities
- `.bg-page` – Main page background
- `.bg-surface` – Card/modal surfaces
- `.bg-paper` – Secondary section backgrounds
- `.bg-cta` – Primary action button background

### Border Utilities
- `.border-light` – Subtle borders
- `.border-medium` – Default borders
- `.border-dark` – Emphasis/interactive borders
- `.border-cta` – CTA accent border

### Component Utilities
- `.btn-primary` – Styled primary button
- `.btn-secondary` – Styled secondary button
- `.btn-outline` – Styled outline button

---

## Typography Classes

All heading classes automatically use **Magnetik** font:
- `.heading-h1` – `text-5xl md:text-6xl`, primary text color
- `.heading-h2` – `text-3xl md:text-4xl`, primary text color
- `.heading-h3` – `text-lg md:text-xl`, primary text color

Body text classes automatically use **Manrope** font:
- `.text-body` – `text-base md:text-lg`, muted text color
- `.text-small` – `text-sm`, tertiary text color

---

## Usage Examples

### Before (Hardcoded Colors)
```jsx
<button className="px-6 py-3 bg-[#007356] text-white">Sign Up</button>
<p className="text-[#616161]">Description</p>
<div className="bg-[#f6f8fa] border border-black/[0.08]">
```

### After (Using Design Tokens)
```jsx
<button className="btn-primary">Sign Up</button>
<!-- OR -->
<button className="px-6 py-3 bg-cta text-white">Sign Up</button>

<p className="text-secondary">Description</p>

<div className="bg-page border border-medium">
```

---

## Components Updated

✅ **Hero.tsx** – All colors centralized
✅ **Navbar.tsx** – Navigation colors standardized
✅ **StyleLibrary.tsx** – Card colors unified
✅ **Footer.tsx** – Footer text colors consistent
✅ **DesignDetailPage.tsx** – Detail page colors aligned
✅ **styles/page.tsx** – Styles listing colors unified

---

## Key Principles

1. **No Hardcoded Hex Values** – All colors derive from CSS variables
2. **Semantic Naming** – Color names reflect their purpose (text-primary, bg-page)
3. **Consistent Spacing** – Borders use medium by default, light for subtle, dark for emphasis
4. **Single Source of Truth** – `:root` variables in globals.css

---

## Migration Notes

- `text-gray-*` → `.text-secondary` / `.text-tertiary` / `.text-muted`
- `text-[#0d0d0d]` → `.text-primary` or use heading classes
- `bg-[#f6f8fa]` → `.bg-page`
- `bg-white` → `.bg-surface`
- `border-gray-*` → `.border-light` / `.border-medium` / `.border-dark`
- `text-[#616161]` → `.text-secondary`
