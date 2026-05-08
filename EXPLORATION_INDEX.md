# StyleMD UI Codebase Exploration - Index

## Quick Navigation

This exploration consists of three comprehensive documents:

### 1. **CODEBASE_EXPLORATION.md** (19KB, 12 sections)
**Most detailed reference guide**

- Project structure & file organization
- Generate feature architecture (7 pipeline stages)
- Style.md rendering pipeline (extraction → HTML generation)
- `/generate?run=levainbakery-2` endpoint flow (API + fixture fallback)
- Backend API endpoints reference (6 endpoints, SSE event types)
- Fixture system for offline demo data
- Key TypeScript interfaces & types
- Configuration & environment setup
- Design card system (static + dynamic)
- Page routes & layouts
- Technology stack details
- Summary table of all components

**Best for:** Understanding the complete architecture, API contracts, and data types

---

### 2. **ARCHITECTURE_DIAGRAMS.md** (29KB, 8 visual diagrams)
**ASCII diagrams and flow charts**

- System architecture visualization (Frontend ↔ Backend)
- Generate feature data flow (URL input → display)
- Style.md rendering pipeline (Markdown → HTML)
- Deep-link resolution (`/generate?run=id`)
- State management (SSEContext structure & methods)
- Component hierarchy (React tree)
- File organization by feature (Generate, Styles, Shared)
- Rendering paths (Static vs Generated)

**Best for:** Visual understanding of data flow, state management, and component relationships

---

### 3. **FINAL_SUMMARY.md** (printed above)
**High-level overview**

- Project overview
- 10 key findings
- Technology stack
- Summary table
- Connections diagram

**Best for:** Quick reference, onboarding, presentations

---

## What Each Document Answers

| Question | Document |
|----------|----------|
| How does `/generate?run=levainbakery-2` work? | CODEBASE_EXPLORATION (Section 4) + ARCHITECTURE_DIAGRAMS (Diagram 4) |
| What is the 7-stage pipeline? | CODEBASE_EXPLORATION (Section 2) |
| How is style.md parsed and rendered? | CODEBASE_EXPLORATION (Section 3) + ARCHITECTURE_DIAGRAMS (Diagram 3) |
| What backend endpoints exist? | CODEBASE_EXPLORATION (Section 5) |
| What data types are used? | CODEBASE_EXPLORATION (Section 7) |
| How does the fixture system work? | CODEBASE_EXPLORATION (Section 6) |
| What are the routes? | CODEBASE_EXPLORATION (Section 10) |
| Which files should I read first? | CODEBASE_EXPLORATION (Section 12) |
| How does SSEContext work? | ARCHITECTURE_DIAGRAMS (Diagram 5) |
| What's the component tree? | ARCHITECTURE_DIAGRAMS (Diagram 6) |

---

## File Locations

```
/Users/gouthamsankar/Codes/stylemd-ui/

├── CODEBASE_EXPLORATION.md          ← Start here for details
├── ARCHITECTURE_DIAGRAMS.md         ← Start here for visuals
├── EXPLORATION_INDEX.md             ← This file
├── README.md                        ← Original project README
├── BACKEND_PERSISTENCE_GUIDE.md     ← Backend-specific docs
├── style.md                         ← Project's own design system

app/                    - Routes and pages
├── (main)/
│   ├── generate/      ← Key: GeneratePageContent.tsx
│   └── styles/
components/             - React components
├── FetchedRunDesignDetail.tsx      ← Displays results
├── CatalogMainSections.tsx         ← Rich preview
└── ...

lib/                    - Core logic
├── sse-context.tsx                 ← Key: State management (592 lines)
├── stylemd-structured-view.ts      ← Key: Rendering (528 lines)
├── stylemd-markdown-html.ts        ← HTML generation
├── fixture-runs.ts                 ← Offline demo data
├── api-types.ts                    ← TypeScript types
├── api-config.ts                   ← API configuration
└── ...

fixtures/
└── levainbakery-2-style.md        ← Demo fixture
```

---

## Key Files by Feature

### Generate Feature
- **Entry:** `app/(main)/generate/page.tsx`
- **Logic:** `app/(main)/generate/GeneratePageContent.tsx`
- **State:** `lib/sse-context.tsx`
- **Display:** `components/FetchedRunDesignDetail.tsx`
- **Progress:** `components/PipelineView.tsx`

### Style.md Rendering
- **Extraction:** `lib/stylemd-structured-view.ts` → `extractStyleMdUi()`
- **Rich HTML:** `lib/stylemd-structured-view.ts` → `renderStructuredDesignHtml()`
- **Markdown HTML:** `lib/stylemd-markdown-html.ts` → `renderPlainStyleMd()`
- **Display:** `components/CatalogMainSections.tsx`

### Fixture System
- **Registry:** `lib/fixture-runs.ts` → `FIXTURES` object
- **Loading:** `lib/fixture-runs.ts` → `fetchFixtureRun()`
- **File:** `fixtures/levainbakery-2-style.md`

### Styles Catalog
- **List:** `app/(main)/styles/page.tsx`
- **Detail:** `app/(main)/styles/[slug]/page.tsx`
- **Cards:** `lib/design-cards.ts` (static definitions)
- **Conversion:** `lib/stylemd-to-design-card.ts`

---

## Technology Stack at a Glance

```
Frontend:
  - Next.js 14.0.0 (App Router)
  - React 18.3.1
  - TypeScript 5.4.5
  - Tailwind CSS 3.4.3
  - lucide-react (icons)

State & Data:
  - React Context API (SSEContext)
  - Server-Sent Events (SSE) for real-time updates
  - EventSource API for backend streaming

Styling:
  - Tailwind CSS
  - CSS variables
  - PostCSS 8.4.38
  - Autoprefixer

Build & Dev:
  - Next.js dev server (port 3000)
  - Express API backend (port 3002)
  - TypeScript compilation
  - ESLint for code quality
```

---

## Data Flow Summary

```
┌─────────────────────────────────────────────────┐
│ User Visit: /generate?run=levainbakery-2        │
└────────────────┬────────────────────────────────┘
                 │
         ┌───────▼───────┐
         │ GeneratePageContent
         │ Parses: run param
         └───────┬───────┘
                 │
         ┌───────▼────────────────┐
         │ SSEContext.viewRun()   │
         └───────┬────────────────┘
                 │
    ┌────────────┴────────────┐
    │                         │
┌───▼──────────┐       ┌──────▼──────────┐
│ Try API      │       │ Load Fixture    │
│ /api/...     │       │ /public/...     │
│ (fails)      │       │ (fallback)      │
└───┬──────────┘       └──────┬──────────┘
    │                         │
    └────────────┬────────────┘
                 │
         ┌───────▼──────────────────┐
         │ Parse style.md           │
         │ extractStyleMdUi()       │
         └───────┬──────────────────┘
                 │
    ┌────────────┴────────────┐
    │                         │
┌───▼────────────┐      ┌──────▼────────┐
│ JSON Payload   │      │ Markdown Text │
└───┬────────────┘      └──────┬────────┘
    │                          │
    ▼                          ▼
renderStructured         renderPlainStyleMd
DesignHtml()            ()
    │                          │
    └────────────┬─────────────┘
                 │
         ┌───────▼──────────┐
         │ Combined HTML    │
         └───────┬──────────┘
                 │
         ┌───────▼──────────────────────┐
         │ FetchedRunDesignDetail       │
         │ Display with tabs:           │
         │ - Preview                    │
         │ - Code                       │
         │ - Website Screenshot         │
         └──────────────────────────────┘
```

---

## Common Tasks & Where to Find Info

| Task | Location |
|------|----------|
| Understand how generation works | CODEBASE_EXPLORATION §2, ARCHITECTURE_DIAGRAMS §2 |
| Add a new API endpoint | CODEBASE_EXPLORATION §5 |
| Modify style.md rendering | CODEBASE_EXPLORATION §3, lib/stylemd-*.ts |
| Add a new fixture | lib/fixture-runs.ts FIXTURES object |
| Change state management | lib/sse-context.tsx |
| Modify design card layout | components/CatalogMainSections.tsx |
| Add new route | app/(main)/ directory |
| Configure API endpoint | lib/api-config.ts, .env.local |
| Understand TypeScript types | CODEBASE_EXPLORATION §7, lib/api-types.ts |
| Fix deep-link issues | CODEBASE_EXPLORATION §4, ARCHITECTURE_DIAGRAMS §4 |

---

## Key Concepts

**Style.md:** A markdown file format containing:
- Optional JSON block (```stylemd-ui { ... }```) with design tokens
- Optional narrative markdown section with guidelines

**Fixture:** Offline demo data bundled with the app. Allows `/generate?run=levainbakery-2` to work without backend.

**SSEContext:** React Context providing global state for generation pipeline, SSE connection, and run history.

**RunData:** Complete data object representing a generated or loaded run, including URL, markdown, status, etc.

**StyleMdUiPayload:** Parsed JSON from style.md containing brand, fonts, palette, spacing, elevation, etc.

**Pipeline Stages:** 7 sequential steps (capture, extract, dedup, curate, responsive, styleguide, showcase) that transform a website URL into a design system markdown.

---

## Quick Start for Development

```bash
# Install dependencies
npm install

# Run dev server
npm run dev
# → Frontend runs on localhost:3000

# Backend API (separate service)
# Ensure localhost:3002 is running with Express API

# Visit a deep-link
# http://localhost:3000/generate?run=levainbakery-2

# View source files
# lib/sse-context.tsx (state management)
# app/(main)/generate/GeneratePageContent.tsx (UI logic)
# lib/stylemd-structured-view.ts (rendering)
```

---

## Navigation Guide

**If you want to understand:**
- **Architecture**: Read ARCHITECTURE_DIAGRAMS.md first (visual), then CODEBASE_EXPLORATION.md for details
- **A specific feature**: Find it in CODEBASE_EXPLORATION.md table of contents
- **How a URL flows through the system**: See ARCHITECTURE_DIAGRAMS.md Diagram 4
- **State management**: See ARCHITECTURE_DIAGRAMS.md Diagram 5 or CODEBASE_EXPLORATION.md §2
- **Data types**: See CODEBASE_EXPLORATION.md §7
- **API endpoints**: See CODEBASE_EXPLORATION.md §5

---

## File Modification Dates

Generated: May 3, 2026
- CODEBASE_EXPLORATION.md - Comprehensive technical reference
- ARCHITECTURE_DIAGRAMS.md - Visual data flow diagrams
- EXPLORATION_INDEX.md - This navigation guide

---

**Happy exploring!**
