# Design System - DesignProbe UI

## Color Palette

### Primary Colors
- **Primary Brand Cyan**: `#0EA5E9` - Used for main CTA buttons and accents
- **Dark Navy**: `#000000` / `#1A1A1A` - Text, buttons, dark backgrounds
- **White**: `#FFFFFF` - Main background, card backgrounds
- **Light Gray**: `#F5F5F5` - Secondary backgrounds

### Accent Colors
- **Teal Brand**: `#14B8A6` - Logo and brand accents
- **Bright Lime**: `#EFFF00` - Snapchat card highlight
- **Vibrant Purple**: `#A855F7` - Purple badge/icon
- **Hot Pink**: `#EC4899` - Pink accents
- **Bright Green**: `#22C55E` - Success/positive indicators
- **Orange**: `#FF8C00` - Orange elements
- **Blue**: `#3B82F6` - Various blue accents

### Gradient Colors
- **Pink to Orange Gradient**: `#EC4899 → #FF8C00` - Stripe card
- **Teal to Purple Gradient**: `#06B6D4 → #8B5CF6` - Lovable card

## Typography

### Font Families
- **Headings (H1, H2, H3)**: `Magnetik` - Bold, modern display font
- **Body Text**: `Manrope` - Clean, readable sans-serif
- **Brand/Navigation**: `Funnel Display` - Display font for branding

### Font Weights
- **100**: Thin
- **200**: ExtraLight
- **300**: Light
- **400**: Regular
- **500**: Medium
- **600**: SemiBold
- **700**: Bold
- **800**: ExtraBold
- **900**: Heavy

### Heading Styles
- **H1 (Hero Title)** (`.heading-h1`): 60px, 700 (bold), line-height: tight, Magnetik font
  - Text: "Give your AI tool project a design makeover"
- **H2 (Section Title)** (`.heading-h2`): 30px (mobile) → 36px (md), 700 (bold), line-height: tight, Magnetik font
  - Text: "Style Library"
- **H3 (Card Title)** (`.heading-h3`): 18px (mobile) → 20px (md), 700 (bold), Magnetik font

### Body Styles
- **text-body**: 16px (mobile) → 18px (md), 400 (regular), line-height: relaxed, Manrope font, muted color
- **text-small**: 14px, 400 (regular), line-height: default, Manrope font, tertiary text color

### Utility Font Classes
- `.font-funnel`: Funnel Display font for branding elements (logo, section headers)
- `.font-manrope`: Manrope font for body text and links
- `.font-magnetik`: Magnetik font for general utility

## Layout & Spacing

### Container & Grid
- **Max Width**: 1200px (full-width with 24px side padding)
- **Grid System**: 3-column grid for style library cards (responsive: 1 col on mobile, 2 on tablet, 3 on desktop)
- **Gap**: 24px (between grid items)
- **Section Padding**: 60px top/bottom, 24px left/right

### Spacing Scale
- **xs**: 4px
- **sm**: 8px
- **md**: 12px
- **lg**: 16px
- **xl**: 24px
- **2xl**: 32px
- **3xl**: 48px
- **4xl**: 64px

## Components

### Navbar
- **Height**: 64px
- **Background**: White with subtle shadow
- **Logo**: "DesignProbe" in teal (`#14B8A6`) with icon
- **Navigation Links**: Dark text, 14px, hover: opacity 0.7
- **CTA Buttons**: 
  - Log In: Transparent, dark text outline
  - Sign Up: Black background, white text, rounded 6px
- **Layout**: Flex, space-between, items centered

### Hero Section
- **Background**: White
- **Content Width**: Max 700px, centered
- **Main Heading**: 56px bold, dark text with "Lovable" in black highlight box
- **Subheading**: 16px, gray text
- **Decorative Icons**: Scattered colorful badges around the section (position: absolute)
- **CTA Button**: Blue background (`#0EA5E9`), white text, rounded 6px, 14px font

### Two-Column Content Section
- **Layout**: Two cards side-by-side
- **Left Card** ("Start with a reference website"):
  - White background, subtle border
  - Input: "Paste any website URL", placeholder text
  - Button: "Generate DESIGN.md", black background
- **Right Card** ("Select from a catalog"):
  - White background, illustration/preview area
  - Title: "Select from a catalog of 100+ curated styles"

### Integration Logos Section
- **Title**: "WORKS ACROSS APPS YOU ❤️", centered
- **Layout**: Flex, 5 logos in a row, centered
- **Logos**: Replift, Clause, Lovable, Base64, emergent

### Style Library Section
- **Title**: "Style Library" (left-aligned)
- **Search Bar**: Placeholder "Search", light gray background
- **Filter Tabs**: All (active/blue), Trending, SaaS, Fintech, Ecommerce, Consumer, Hardware, Logistics
- **Layout**: Horizontal scrollable or wrapped

### Style Cards
- **Dimensions**: ~280px width × 200px height
- **Background**: Colorful gradients or solid colors (varies per card)
- **Border Radius**: 12px
- **Content**:
  - Top area: Logo or illustration
  - Bottom area: Title + "View now" button (dark, 12px)
  - Button hover: Opacity change or slight scale
- **Spacing**: 24px gap between cards

### Buttons
- **Primary Button** (Blue CTA):
  - Background: `#0EA5E9`
  - Color: White
  - Padding: 12px 24px
  - Border Radius: 6px
  - Font Size: 14px
  - Font Weight: 600
  - Hover: Opacity 0.9 or slight shadow
  
- **Secondary Button** (Black):
  - Background: `#000000`
  - Color: White
  - Padding: 10px 20px
  - Border Radius: 6px
  - Font Size: 12px
  - Hover: Opacity 0.85

- **Outline Button**:
  - Background: Transparent
  - Border: 1px solid `#E5E5E5`
  - Color: Dark text
  - Padding: 12px 24px

### Input Fields
- **Background**: `#F9F9F9` / `#F5F5F5`
- **Border**: 1px solid `#E5E5E5`
- **Border Radius**: 6px
- **Padding**: 12px 16px
- **Font Size**: 14px
- **Placeholder Color**: `#999999`
- **Focus**: Border color changes to blue (`#0EA5E9`), outline: none

## Shadows & Effects

### Card Shadow
- Light: `0 1px 3px rgba(0, 0, 0, 0.08)`
- Medium: `0 4px 12px rgba(0, 0, 0, 0.12)`

### Transitions
- Default: `all 200ms ease-in-out`
- Button Hover: Scale 1.02, shadow increase

## Responsive Design

### Breakpoints
- **Mobile**: < 640px
- **Tablet**: 640px - 1024px
- **Desktop**: > 1024px

### Mobile Adjustments
- Hero heading: 32px
- Grid: 1 column
- Padding: 16px
- Navbar: Hamburger menu style
- Font sizes: Scaled down by 10-15%

## Icon System

### Badge Icons (Decorative)
- Colorful circle badges with icons inside
- Size: 64px × 64px
- Border Radius: 50% or 12px (varies)
- Positioned absolutely around sections
- Examples: Figma icon (blue), LinkedIn icon (dark), Slack icon (pink), etc.

## Border Radius

- **Small**: 4px
- **Medium**: 6px
- **Large**: 12px
- **Full**: 50% (circles)

## Opacity & Hover States

- **Default Hover**: 0.85 opacity on buttons
- **Link Hover**: Underline appears or opacity changes
- **Icon Hover**: Slight scale (1.05) or color change
- **Card Hover**: Subtle shadow increase

---

This style guide provides the foundational design system for the DesignProbe UI. All components should follow these specifications for consistency and cohesion across the application.
