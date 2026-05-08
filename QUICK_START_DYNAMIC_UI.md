# Quick Start: Dynamic UI Template Integration

## What Changed?

✅ **All generated pages now use the levainbakery-2 (or any DB run) design system as a visual reference alongside your generated designs.**

When you generate a design, you'll see:
- **Left sidebar**: The template design system fetched from database (typography, colors, spacing, etc.)
- **Main area**: Your generated design's style.md with preview and code tabs

**Data Source**: Template designs are fetched directly from the database via API, ensuring you always see real, up-to-date design systems.

## How to Use

### 1. Generate a Design (No Changes Required)

```
Navigate to → http://localhost:3000/generate
         ↓
Enter URL to analyze
         ↓
Wait for generation to complete
         ↓
See your generated design with levainbakery-2 template sidebar
```

### 2. What You See

Your generated page now has:

```
┌──────────────────────────────────────────────┐
│ Header: [Back] [Copy style.md] [Download]    │
├──────────────────────────────────────────────┤
│         YOUR GENERATED BRAND INFO             │
│    (Logo, description, tags from generated)   │
├─────────────┬────────────────────────────────┤
│  LEVAIN'S   │  YOUR GENERATED DESIGN         │
│  DESIGN     │                                │
│  SYSTEM     │  [Live Preview] [STYLE.md]     │
│  REFERENCE  │                                │
│             │  • Typography                  │
│  • Colors   │  • Palette                     │
│  • Fonts    │  • Spacing                     │
│  • Spacing  │  • Elevation                   │
│  • Motion   │  • Motion                      │
│  • Rules    │  • Guidelines                  │
│             │                                │
└─────────────┴────────────────────────────────┘
```

### 3. Key Features

| Feature | How It Works |
|---------|-------------|
| **Live Preview** | Shows rich, styled preview of your design |
| **STYLE.md View** | Shows raw markdown of generated design |
| **Copy Button** | Copies your style.md to clipboard |
| **Download Button** | Downloads style.md as file |
| **Template Sidebar** | Reference design system (hidden on mobile) |

## File Changes

### Modified Files:
1. ✏️ `components/FetchedRunDesignDetail.tsx` - Added template loading and dual-column layout
2. ✏️ `components/DesignDetailPage.tsx` - Added new props
3. ✏️ `app/(main)/generate/GeneratePageContent.tsx` - Enabled template by default

### New Files:
1. ➕ `components/DynamicUIWrapper.tsx` - Reusable wrapper component
2. ➕ `DYNAMIC_UI_INTEGRATION.md` - Detailed technical guide
3. ➕ `QUICK_START_DYNAMIC_UI.md` - This file

## Responsive Design

- **Mobile**: Template sidebar hidden, full-width design view
- **Tablet**: Single column layout
- **Desktop**: Split view with template on left

## Customization

### Change the Template Design

You can use any run from the database as the template! Edit `app/(main)/generate/GeneratePageContent.tsx`:

```typescript
<DesignDetailPage
  // ... other props
  templateRunId="stylemd_1777797974291"  // Use any DB run ID/slug
/>
```

Or use a slug if available:
```typescript
templateRunId="my-design-slug"
```

The component will fetch the design from the database and use it as the template sidebar.

### Disable Template (Revert to Old Layout)

Edit `app/(main)/generate/GeneratePageContent.tsx`:

```typescript
<DesignDetailPage
  // ... other props
  useDynamicUITemplate={false}  // Set to false
/>
```

## Troubleshooting

### Template Not Loading?
- Check network tab for `/api/stylemd/by-slug/...` request
- Ensure the template run ID/slug exists in the database
- Verify API_BASE is configured correctly
- Check browser console for error messages
- Try with a different run ID that you know exists in the database

### Layout Looks Wrong?
- Clear cache: Hard refresh (Cmd+Shift+R on Mac, Ctrl+Shift+R on Windows)
- Check if you're on a large screen (template sidebar only appears on desktop)

### Want Old Layout Back?
Set `useDynamicUITemplate={false}` in `GeneratePageContent.tsx`

## Performance

✅ **No performance impact**
- Template loads asynchronously
- Doesn't block page rendering
- Uses existing component infrastructure

## Next Steps

1. Test by generating a design: `http://localhost:3000/generate`
2. Try different designs to see varied content with consistent template
3. Customize the template ID if you want different reference design
4. Check `DYNAMIC_UI_INTEGRATION.md` for advanced features

---

**Questions?** Check the full technical guide in `DYNAMIC_UI_INTEGRATION.md`
