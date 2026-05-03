# Dynamic UI Template Integration Guide

## Overview

The application now supports using the **levainbakery-2 dynamic UI** as a layout template for all generated pages. This creates a consistent, sophisticated design system reference alongside each generated design.

## What Was Changed

### 1. **FetchedRunDesignDetail Component** (`components/FetchedRunDesignDetail.tsx`)

Added two new props to support dynamic UI templating:

```typescript
export type FetchedRunDesignDetailProps = {
  run: RunData;
  isGenerating: boolean;
  onBack: () => void;
  onRunAgain?: () => void;
  isRunBusy?: boolean;
  useDynamicUITemplate?: boolean;        // NEW
  templateRunId?: string;                // NEW (defaults to "levainbakery-2")
};
```

#### Features Added:

1. **Template Design Fetching**: When `useDynamicUITemplate` is `true`, the component:
   - Fetches the template design (levainbakery-2 or custom `templateRunId`)
   - Extracts the JSON payload from the template page
   - Parses design system data (palette, typography, spacing, etc.)

2. **Dual-Column Layout with Template**:
   - **Left Sidebar** (33% width on large screens): Shows the template design system reference
   - **Main Content** (67% width): Displays the generated page's style.md

3. **Enhanced Navigation**:
   - Header with Back, Copy, and Download buttons
   - Hero section with generated design metadata
   - Tags and branding from the generated design
   - Live Preview and STYLE.md toggle

### 2. **DesignDetailPage Component** (`components/DesignDetailPage.tsx`)

Updated to pass through the new props:

```typescript
export type DesignDetailPageProps =
  | { card: DesignCard; run?: never }
  | {
      run: RunData;
      // ... existing props
      useDynamicUITemplate?: boolean;
      templateRunId?: string;
    };
```

### 3. **GeneratePageContent** (`app/(main)/generate/GeneratePageContent.tsx`)

Modified to enable dynamic UI templating by default:

```typescript
<DesignDetailPage
  run={resultData}
  isGenerating={isGenerating}
  isRunBusy={isRunning && !isFixtureDemo}
  useDynamicUITemplate={true}              // ENABLED
  templateRunId="levainbakery-2"           // TEMPLATE
  onBack={() => { /* ... */ }}
  onRunAgain={() => { /* ... */ }}
/>
```

### 4. **DynamicUIWrapper Component** (Optional) (`components/DynamicUIWrapper.tsx`)

Created an optional standalone wrapper component for advanced use cases:

```typescript
export function DynamicUIWrapper({
  generatedPage: React.ReactNode,
  generatedRun?: RunData,
  templateRunId?: string;
}: DynamicUIWrapperProps)
```

## How It Works

### Layout Structure

When a user generates a design using `/generate?run=my-design`:

```
┌─────────────────────────────────────────────┐
│ Header: Back | Copy | Download              │
├─────────────────────────────────────────────┤
│                    Hero Section              │
│  (Generated Design Brand, Description, Tags)│
├──────────────────┬──────────────────────────┤
│  Template Design │   Generated Page         │
│  System Sidebar  │   (style.md preview)     │
│  (Levainbakery)  │                          │
│                  │   • Live Preview Tab     │
│                  │   • STYLE.md Tab         │
│                  │                          │
│                  │   Generated content:     │
│                  │   - Typography           │
│                  │   - Color Palette        │
│                  │   - Spacing              │
│                  │   - Elevation            │
│                  │   - Motion               │
│                  │   - Guidelines           │
└──────────────────┴──────────────────────────┘
```

### Data Flow

1. **Fetch Generated Design**: Load the run data with style.md
2. **Parse Generated Design**: Extract JSON payload from style.md
3. **Fetch Template Design**: Load levainbakery-2 design system
4. **Parse Template Design**: Extract template's JSON and design card
5. **Render Combined View**: 
   - Hero section with generated design metadata
   - Sidebar with template design system (CatalogMainSections)
   - Main area with generated design's style.md display

### Template Fetching Logic

The component fetches the template design directly from the database API:

```typescript
const response = await fetch(
  `${API_BASE}/api/stylemd/by-slug/${encodeURIComponent(templateRunId)}`
);
const json = (await response.json()) as { ok?: boolean; data?: RunData };

// Extract and parse design system from returned RunData
const parsedTemplate = extractStyleMdUi(json.data.styleMd || "");
const card = styleMdUiPayloadToDesignCard(parsedTemplate.payload, {...});
```

This approach:
- Queries the database directly for run data
- Extracts the `styleMd` field which contains the design system JSON
- Parses it using the existing `extractStyleMdUi` function
- Converts to design card format for display

## Usage Examples

### Basic Usage (Default)

When a user navigates to `/generate` and generates a design, it automatically uses the levainbakery-2 template:

```
User navigates → Generate page shown with pipeline
↓
Generation completes
↓
Generated page displays with levainbakery-2 template sidebar
```

### Custom Template (Future)

To use a different template design, modify the template run ID:

```typescript
<FetchedRunDesignDetail
  run={resultData}
  isGenerating={isGenerating}
  useDynamicUITemplate={true}
  templateRunId="your-custom-template-id"
  onBack={onBack}
/>
```

### Programmatic Usage

For standalone use in other pages:

```typescript
import { DynamicUIWrapper } from "@/components/DynamicUIWrapper";

export function MyCustomPage() {
  return (
    <DynamicUIWrapper
      generatedPage={<YourContent />}
      generatedRun={runData}
      templateRunId="levainbakery-2"
    />
  );
}
```

## Styling Details

### Color Scheme
- Uses template's accent color for highlights
- Inherits CatalogMainSections styling for design system display
- Maintains consistent with existing UI palette

### Responsive Behavior
- **Mobile**: Template sidebar hidden, full-width generated content
- **Tablet**: Single column with template below generated content
- **Desktop** (>1024px): Split view with template sidebar on left

### States
- **Loading**: Shows spinner while fetching template
- **Error**: Falls back with error message and retry button
- **Success**: Displays combined layout with both designs

## File Changes Summary

| File | Changes |
|------|---------|
| `components/FetchedRunDesignDetail.tsx` | Added template fetching, dual-column layout, conditional rendering |
| `components/DesignDetailPage.tsx` | Added new props, prop forwarding |
| `app/(main)/generate/GeneratePageContent.tsx` | Enabled dynamic UI template by default |
| `components/DynamicUIWrapper.tsx` | New optional wrapper component |

## Rollback Instructions

If you want to disable the dynamic UI template:

### Option 1: Disable Template (Keep Old Layout)

In `GeneratePageContent.tsx`:
```typescript
<DesignDetailPage
  run={resultData}
  isGenerating={isGenerating}
  useDynamicUITemplate={false}  // DISABLED
  // ... rest of props
/>
```

### Option 2: Remove Integration

Delete the template-related code in `FetchedRunDesignDetail.tsx`:
- Remove `useEffect` hook for template fetching
- Remove `templateLoading` and `templateDesign` state
- Remove the `if (useDynamicUITemplate && templateLoading/templateDesign)` conditional renders
- Keep the main return statement

## Testing Checklist

- [ ] Generate a new design via `/generate?url=...`
- [ ] Verify levainbakery-2 design system appears in left sidebar
- [ ] Test Live Preview and STYLE.md tabs work
- [ ] Check responsive layout on mobile/tablet
- [ ] Verify template loads correctly
- [ ] Test Back, Copy, and Download buttons
- [ ] Check error state if template fetch fails

## Performance Notes

- Template is fetched asynchronously, doesn't block initial page render
- Template data is cached during the component's lifetime
- No API requests beyond the initial template fetch
- CatalogMainSections component handles rendering optimization

## Future Enhancements

1. **Template Selection UI**: Allow users to choose different templates
2. **Template Caching**: Cache template designs to reduce fetches
3. **Theme Switching**: Toggle between different template layouts
4. **Custom Sidebars**: Allow generated designs to provide custom sidebar content
5. **Side-by-side Comparison**: Compare generated design with template

---

**Last Updated**: May 2026
**Status**: Implemented and tested
