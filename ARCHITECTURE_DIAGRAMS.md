# StyleMD UI Architecture & Data Flow Diagrams

## 1. Overall System Architecture

```
┌─────────────────────────────────────────────────────────────────┐
│                    STYLEMD UI FRONTEND                          │
│                   (Next.js 14 @ :3000)                          │
├─────────────────────────────────────────────────────────────────┤
│                                                                 │
│  Pages:                  Components:           Utilities:      │
│  ├─ / (home)            ├─ Hero              ├─ sse-context   │
│  ├─ /styles             ├─ Navbar            ├─ fixture-runs  │
│  ├─ /styles/[slug]      ├─ StyleLibrary      ├─ api-config    │
│  ├─ /generate           ├─ DesignDetailPage  ├─ api-types     │
│  └─ /generate?run=[id]  ├─ FetchedRunDetail  ├─ stylemd-*     │
│                         ├─ PipelineView      └─ design-cards  │
│                         └─ CatalogSections                    │
│                                                                 │
└────────────┬────────────────────────────┬──────────────────────┘
             │                            │
             │ HTTP/SSE                   │ Fixtures
             │ /api/stylemd/*             │ /public/fixtures/
             │                            │
        ┌────▼────────────────────────────▼────────┐
        │  BACKEND API                             │
        │  (Express @ localhost:3002)              │
        │  Handles:                                │
        │  ├─ /api/stylemd                         │
        │  ├─ /api/stylemd/runs                    │
        │  ├─ /api/stylemd/by-slug/{id}            │
        │  ├─ /api/scraped-data                    │
        │  ├─ /api/session/events (SSE)            │
        │  └─ /api/stylemd/persist                 │
        │                                          │
        │  Pipeline:                               │
        │  ├─ capture (screenshot)                 │
        │  ├─ extract (parse CSS/fonts)            │
        │  ├─ dedup (remove duplicates)            │
        │  ├─ curate (validate)                    │
        │  ├─ responsive (test breakpoints)        │
        │  ├─ styleguide (generate style.md)       │
        │  └─ showcase (render preview)            │
        └──────────────────────────────────────────┘
```

---

## 2. Generate Feature Data Flow

```
┌────────────────────────────────────────────────────────────────────┐
│ USER ENTERS URL & CLICKS "GENERATE"                                │
└────────────────────────┬───────────────────────────────────────────┘
                         │
                         ▼
        ┌─────────────────────────────────────┐
        │  startRun(url, provider)            │
        │  (SSEContext → dispatches action)   │
        └────────────┬────────────────────────┘
                     │
                     ▼
        ┌─────────────────────────────────────┐
        │  POST /api/stylemd                  │
        │  Payload: { url, provider }         │
        │  Response: { ok, runId }            │
        └────────────┬────────────────────────┘
                     │
                     ▼
        ┌─────────────────────────────────────┐
        │  Connect EventSource                │
        │  GET /api/session/events            │
        └────────────┬────────────────────────┘
                     │
        ┌────────────┼────────────────────────┐
        │            │                        │
        ▼            ▼                        ▼
    stylemd_    stylemd_              stylemd_
    run_started stage_started...    run_completed
        │            │                        │
        ▼            ▼                        ▼
    Set activeRun  Update stages          Set resultData
    screen:"running" progress bar        screen:"result"
        │            │                        │
        │            │                        ▼
        │            │            (Parallel) Polling fallback
        │            │            GET /api/stylemd/by-slug/{runId}
        │            │            ↓ (every 2 seconds, up to 120x)
        │            │            ✓ Fetch full record (screenshot, etc)
        │            │
        └────────────┴──────────────────────────┐
                                                 │
                                                 ▼
                                ┌────────────────────────────┐
                                │  FetchedRunDesignDetail    │
                                │  Display design system     │
                                │  • Parse style.md          │
                                │  • Extract JSON payload    │
                                │  • Render rich HTML        │
                                │  • Show tabs:              │
                                │    - Preview               │
                                │    - Code                  │
                                │    - Website               │
                                └────────────────────────────┘
```

---

## 3. Style.md Rendering Pipeline

```
┌──────────────────────────────────────────────────────────────────┐
│  RAW STYLE.MD (from backend or fixture)                          │
│                                                                  │
│  ```stylemd-ui                                                   │
│  {                                                               │
│    "brand": "Levain Bakery",                                     │
│    "accentColor": "#e8006f",                                     │
│    "fonts": [...],                                               │
│    "palette": [...]                                              │
│  }                                                               │
│  ```                                                             │
│                                                                  │
│  # Design Notes                                                  │
│  Some **bold** and *italic* text...                             │
└────────────┬─────────────────────────────────────────────────────┘
             │
             ▼
  ┌──────────────────────────────────┐
  │ extractStyleMdUi(md)             │
  │ Returns:                         │
  │ {                                │
  │   payload: StyleMdUiPayload,    │
  │   remainder: "# Design Notes..." │
  │ }                                │
  └──────────┬───────────────────────┘
             │
      ┌──────┴──────┐
      │             │
      ▼             ▼
  ┌─────────────┐  ┌──────────────────┐
  │  payload    │  │  remainder       │
  │  JSON       │  │  markdown        │
  └────┬────────┘  └────────┬─────────┘
       │                    │
       ▼                    ▼
 renderStructured      renderPlainStyleMd
 DesignHtml()          ()
       │                    │
       ▼                    ▼
  ┌─────────────┐      ┌─────────────┐
  │  Rich HTML: │      │  HTML:      │
  │ • Hero      │      │ • <h1>      │
  │ • Typography│      │ • <p>       │
  │ • Palette   │      │ • <strong>  │
  │ • Spacing   │      │ • <em>      │
  │ • Elevation │      │ • <code>    │
  │ • Shapes    │      │ • <ul>      │
  │ • Motion    │      │ • <hr>      │
  │ • Guidelines│      └─────────────┘
  └─────────────┘
       │
       └──────┬──────┘
              │
              ▼
       ┌─────────────────┐
       │  Combined HTML  │
       │  (joined with   │
       │   <hr> if both) │
       └────────┬────────┘
                │
                ▼
       ┌──────────────────────┐
       │ dangerouslySetInner  │
       │ HTML in component    │
       │ or CatalogSections   │
       └──────────────────────┘
```

---

## 4. Deep-Link Resolution: `/generate?run=levainbakery-2`

```
┌────────────────────────────────────────────────────────────────┐
│  URL: http://localhost:3000/generate?run=levainbakery-2       │
└────────────┬───────────────────────────────────────────────────┘
             │
             ▼
┌────────────────────────────────────────────────────────────────┐
│ GeneratePageContent.tsx                                        │
│ • Parses searchParams: run = "levainbakery-2"                  │
│ • Calls viewRun("levainbakery-2")                              │
└────────────┬───────────────────────────────────────────────────┘
             │
             ▼
┌────────────────────────────────────────────────────────────────┐
│ SSEContext.viewRun()                                           │
│ Attempts in order:                                             │
└────────────┬───────────────────────────────────────────────────┘
             │
    ┌────────┴────────┬──────────────┐
    │                 │              │
    ▼                 ▼              ▼
┌─────────────┐  (if empty)    (if fails)
│ API Lookup: │     │              │
│             │     ▼              ▼
│ GET /api/   │ ┌──────────────┐ ┌──────────────┐
│ stylemd/by- │ │ Fill with    │ │ Fetch        │
│ slug/levain │ │ fixture if   │ │ fixture      │
│ bakery-2    │ │ exists       │ │ directly     │
│             │ │              │ │              │
│ Response:   │ └──────┬───────┘ └──────┬───────┘
│ { ok, data: │        │                │
│   RunData}  │        │                │
└─────┬───────┘        │                │
      │                │                │
      └────────┬───────┴────────┬───────┘
               │                │
               ▼                ▼
       ┌─────────────────────────────────┐
       │ Fixture Lookup                  │
       │ fixture-runs.ts:FIXTURES        │
       │                                 │
       │ "levainbakery-2" →              │
       │ {                               │
       │   slug: "levainbakery-2",       │
       │   sourceUrl: "https://levain...",
       │   markdownPath:                 │
       │     "/fixtures/stylemd/         │
       │      levainbakery-2-style.md"   │
       │ }                               │
       └────────────┬────────────────────┘
                    │
                    ▼
       ┌─────────────────────────────────┐
       │ fetchFixtureRun()               │
       │ GET /fixtures/stylemd/          │
       │     levainbakery-2-style.md     │
       │                                 │
       │ Returns static markdown file    │
       └────────────┬────────────────────┘
                    │
                    ▼
       ┌─────────────────────────────────┐
       │ Construct RunData Object:       │
       │ {                               │
       │   url: "https://levainbakery.." │
       │   slug: "levainbakery-2",       │
       │   runId: "fixture-levain...-2", │
       │   styleMd: <fetched markdown>,  │
       │   screenshot: "",               │
       │   provider: "kimi",             │
       │   model: "local-fixture",       │
       │   status: "completed",          │
       │   createdAt: "1970-01-01T..."   │
       │ }                               │
       └────────────┬────────────────────┘
                    │
                    ▼
       ┌─────────────────────────────────┐
       │ dispatch({                      │
       │   type: "SET_RESULT",           │
       │   data: RunData                 │
       │ })                              │
       └────────────┬────────────────────┘
                    │
                    ▼
       ┌─────────────────────────────────┐
       │ screen = "result"               │
       │ resultData = RunData             │
       │                                 │
       │ Render FetchedRunDesignDetail   │
       └─────────────────────────────────┘
```

---

## 5. State Management (SSEContext)

```
┌─────────────────────────────────────────────────────────────────┐
│                        SSE CONTEXT STATE                        │
├─────────────────────────────────────────────────────────────────┤
│                                                                 │
│  screen: "home" | "running" | "result"                         │
│    ├─ home: Show home page / input form                        │
│    ├─ running: Show PipelineView with progress                 │
│    └─ result: Show FetchedRunDesignDetail                      │
│                                                                 │
│  runs: RunSummary[]                                            │
│    └─ List of all past runs (from /api/stylemd/runs)           │
│                                                                 │
│  activeRun: ActiveRun | null                                   │
│    └─ Currently executing run (during pipeline)                │
│       ├─ runId, url, provider, model                           │
│       ├─ stages: {capture, extract, ...: {status, duration}}   │
│       └─ logs: LogEntry[]                                      │
│                                                                 │
│  resultData: RunData | null                                    │
│    └─ Completed/fetched run                                    │
│       ├─ url, slug, runId                                      │
│       ├─ styleMd (markdown)                                    │
│       ├─ screenshot, screenshotUrl                             │
│       ├─ status: "completed|failed|..."                        │
│       └─ createdAt                                             │
│                                                                 │
│  isRunning: boolean                                            │
│    └─ Pipeline in progress?                                    │
│                                                                 │
│  networkError: string | null                                   │
│    └─ API/network error message                                │
│                                                                 │
│  runError: string | null                                       │
│    └─ Pipeline execution error                                 │
│                                                                 │
└─────────────────────────────────────────────────────────────────┘

                        METHODS:
        ┌─────────────────────────────────────────┐
        │ startRun(url, provider)                 │
        │  → POST /api/stylemd                    │
        │  → Open SSE connection                  │
        │  → Set screen:"running"                 │
        │                                         │
        │ viewRun(slugOrId)                       │
        │  → Fetch /api/stylemd/by-slug/{id}      │
        │  → Fallback to fixtures                 │
        │  → Set screen:"result"                  │
        │                                         │
        │ runAgain()                              │
        │  → Restart last activeRun               │
        │  → Set screen:"running"                 │
        │                                         │
        │ goHome()                                │
        │  → Reset all to initial state           │
        │  → Set screen:"home"                    │
        │                                         │
        │ dismissNetworkError()                   │
        │  → Clear networkError message           │
        └─────────────────────────────────────────┘
```

---

## 6. Component Hierarchy

```
┌──────────────────────────────────────────────────────────────┐
│  app/layout.tsx (Root)                                       │
│  ├─ Fonts, Global CSS, Metadata                             │
│  └─                                                          │
│     app/(main)/layout.tsx                                    │
│     ├─ Navbar                                                │
│     ├─ Route Outlet                                          │
│     │  ├─ page.tsx → Home                                    │
│     │  │   ├─ Hero                                           │
│     │  │   ├─ IntegrationLogos                               │
│     │  │   └─ StyleLibrary                                   │
│     │  │       └─ [DesignCards]                              │
│     │  │                                                      │
│     │  ├─ generate/page.tsx                                  │
│     │  │  └─ GeneratePageContent (client)                    │
│     │  │      ├─ PipelineView (if running)                   │
│     │  │      └─ FetchedRunDesignDetail (if result)          │
│     │  │          ├─ WebsitePreview                          │
│     │  │          └─ CatalogMainSections                     │
│     │  │              ├─ Hero Section                        │
│     │  │              ├─ Typography Grid                     │
│     │  │              ├─ Palette Swatches                    │
│     │  │              ├─ Spacing System                      │
│     │  │              ├─ Elevation Rules                     │
│     │  │              ├─ Motion Timing                       │
│     │  │              └─ Guidelines                          │
│     │  │                                                      │
│     │  └─ styles/page.tsx                                    │
│     │     └─ DesignDetailPage                                │
│     │         └─ [DesignCards] (catalog)                     │
│     │                                                         │
│     └─ Footer                                                │
│                                                              │
└──────────────────────────────────────────────────────────────┘
```

---

## 7. File Organization by Feature

```
GENERATE FEATURE
├── app/(main)/generate/
│   ├── page.tsx                    ← Entry point
│   ├── GeneratePageContent.tsx     ← Main logic
│   └── [runSlug]/page.tsx          ← Pretty URL redirect
│
├── components/
│   ├── FetchedRunDesignDetail.tsx  ← Display results
│   ├── PipelineView.tsx            ← Progress UI
│   └── CatalogMainSections.tsx     ← Rich preview
│
└── lib/
    ├── sse-context.tsx             ← State + SSE
    ├── fixture-runs.ts             ← Demo data
    ├── api-config.ts               ← API URL
    ├── api-types.ts                ← Types
    └── stylemd-*.ts                ← Rendering

STYLES/CATALOG FEATURE
├── app/(main)/styles/
│   ├── page.tsx                    ← Catalog list
│   └── [slug]/page.tsx             ← Detail view
│
├── components/
│   ├── DesignDetailPage.tsx        ← Detail container
│   ├── CatalogMainSections.tsx     ← Rich display
│   └── StyleLibrary.tsx            ← Library grid
│
└── lib/
    ├── design-cards.ts             ← Static cards
    └── stylemd-to-design-card.ts   ← Conversion

SHARED/UTILITIES
├── lib/
│   ├── stylemd-structured-view.ts  ← JSON parsing
│   ├── stylemd-markdown-html.ts    ← HTML rendering
│   └── api-types.ts                ← Shared types
│
├── components/
│   ├── Hero.tsx
│   ├── Navbar.tsx
│   └── Footer.tsx
│
└── fixtures/
    └── levainbakery-2-style.md     ← Demo fixture

CONFIGURATION
├── next.config.mjs
├── tailwind.config.ts
├── tsconfig.json
├── .env.local.example
└── package.json
```

---

## 8. Rendering Path: URL → Display

```
STATIC CARD (Catalog)
┌─────────────────────┐
│ /styles/[slug]      │
│ e.g., /styles/levain│
└──────────┬──────────┘
           │
           ▼
    ┌─────────────────────────┐
    │ getDesignCardBySlug()    │
    │ from design-cards.ts     │
    └──────────┬──────────────┘
               │
               ▼
        ┌──────────────────┐
        │ DesignCard       │
        │ (hardcoded)      │
        └──────────┬───────┘
                   │
                   ▼
        ┌──────────────────┐
        │ DesignDetailPage │
        │ (card mode)      │
        └──────────┬───────┘
                   │
                   ▼
      ┌────────────────────────┐
      │ CatalogMainSections    │
      │ Renders DesignCard     │
      └────────────────────────┘


GENERATED RUN (from /generate?run=...)
┌──────────────────────────────┐
│ /generate?run=levainbakery-2 │
└──────────────┬───────────────┘
               │
               ▼
        ┌──────────────────┐
        │ viewRun()        │
        │ SSE Context      │
        └──────────┬───────┘
                   │
        ┌──────────┴────────────┐
        │                       │
        ▼                       ▼
    API Lookup          Fixture Lookup
    (try first)         (fallback)
        │                       │
        ▼                       ▼
    RunData          Synthetic RunData
        │                       │
        └──────────┬────────────┘
                   │
                   ▼
        ┌──────────────────────┐
        │ extractStyleMdUi()    │
        │ Parse style.md       │
        │ ↓                    │
        │ StyleMdUiPayload     │
        └──────────┬───────────┘
                   │
                   ▼
        ┌──────────────────────┐
        │styleMdUiPayloadTo    │
        │DesignCard()          │
        │ ↓                    │
        │ DesignCard           │
        └──────────┬───────────┘
                   │
                   ▼
        ┌──────────────────────┐
        │ FetchedRunDesignDetail│
        └──────────┬───────────┘
                   │
                   ▼
      ┌────────────────────────┐
      │ CatalogMainSections    │
      │ Renders DesignCard     │
      └────────────────────────┘
```

---

## Summary

- **Frontend:** Next.js 14 @ localhost:3000
- **Backend API:** Express @ localhost:3002
- **State:** React Context (SSEContext) + Server-Sent Events
- **Rendering:** Markdown → JSON extraction → HTML generation
- **Offline Support:** Bundled fixtures with fallback logic
- **Key Routes:** `/generate`, `/styles`, `/generate?run=<id>`

