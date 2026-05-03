# StyleMD UI Codebase Exploration Report

## 1. PROJECT STRUCTURE

### Key Directories & Files

```
/Users/gouthamsankar/Codes/stylemd-ui/
├── app/                          # Next.js app router structure
│   ├── layout.tsx               # Root layout
│   ├── (main)/                  # Route group for main app
│   │   ├── page.tsx             # Home page (//)
│   │   ├── generate/            # Generate feature routes
│   │   │   ├── page.tsx         # Main generate page
│   │   │   ├── GeneratePageContent.tsx  # Client component for generate
│   │   │   └── [runSlug]/       # Dynamic route for specific runs
│   │   │       └── page.tsx     # Redirect: /generate/levainbakery-2 → /generate?run=levainbakery-2
│   │   ├── [slug]/              # Dynamic catch-all route
│   │   ├── styles/              # Styles/catalog routes
│   │   └── style/               # Legacy route (redirects to /styles)
│   └── spotify/                 # Example demo page
├── components/                   # React UI components
│   ├── DesignDetailPage.tsx      # Main detail view (catalog or generated)
│   ├── FetchedRunDesignDetail.tsx # Display generated style.md runs
│   ├── PipelineView.tsx          # Shows pipeline progress during generation
│   ├── WebsitePreview.tsx        # Website screenshot preview
│   ├── CatalogMainSections.tsx   # Rich design system display
│   ├── Hero.tsx, Navbar.tsx, Footer.tsx # Layout components
│   └── ... (other components)
├── lib/                          # Core utilities & logic
│   ├── sse-context.tsx           # SSE (Server-Sent Events) context for pipeline state
│   ├── fixture-runs.ts           # Demo data management for offline viewing
│   ├── api-config.ts             # API base URL configuration
│   ├── api-types.ts              # TypeScript types for API data
│   ├── stylemd-structured-view.ts # Parse & render structured JSON from style.md
│   ├── stylemd-markdown-html.ts   # Convert style.md to HTML
│   ├── stylemd-to-design-card.ts  # Convert style.md payload to DesignCard
│   └── design-cards.ts            # Static design card catalog
├── fixtures/                     # Static demo data
│   └── levainbakery-2-style.md  # Fixture style.md for Levain Bakery demo
├── public/                       # Static assets (logos, etc.)
├── style.md                      # Project's own style guide (DesignProbe UI)
├── package.json                  # Dependencies: React 18.3.1, Next.js 14, Tailwind
├── tailwind.config.ts            # Tailwind CSS configuration
└── .env.local.example            # Environment variables template
```

---

## 2. GENERATE FEATURE ARCHITECTURE

### Overview
The "Generate" feature lets users input a website URL, and a backend pipeline extracts its design system into a `style.md` file. The UI displays live progress via Server-Sent Events (SSE) and then shows the generated design system.

### Entry Points

**Routes:**
- `/generate` – Main generate page (shows input form or running pipeline)
- `/generate?run=<runId|slug>` – View results of a specific run
- `/generate/<runSlug>` – Pretty URL redirect (converts to query param)

### Data Flow

```
User Input URL
    ↓
SSE Connection to Backend (GET /api/session/events)
    ↓
Backend pipeline starts (POST /api/stylemd-artifacts/run)
    ↓
SSE events stream:
  - stylemd_run_started: runId, URL, provider, model
  - stylemd_stage_started: stage (capture, extract, dedup, curate, responsive, styleguide, showcase)
  - stylemd_stage_completed: stage, durationMs
  - stylemd_stage_failed: stage, error
  - stylemd_action: log entries
  - stylemd_run_completed: status, styleMd (markdown), showcase URL
    ↓
Results fetched: GET /api/stylemd/by-slug/{runId}
    ↓
Display in FetchedRunDesignDetail component
```

### Pipeline Stages
From `lib/api-types.ts`:
1. **capture** – Screenshot & scrape the website
2. **extract** – Parse HTML to find design tokens
3. **dedup** – Remove duplicate values
4. **curate** – Refine and validate tokens
5. **responsive** – Test responsive design
6. **styleguide** – Generate style.md
7. **showcase** – Create showcase page

### Key Components & Hooks

**SSE Context (`lib/sse-context.tsx`)**
- Manages global state for generation pipeline
- Connects to backend SSE endpoint and updates state with events
- Methods:
  - `startRun(url, provider)` – POST to `/api/stylemd-artifacts/run`
  - `viewRun(slugOrId)` – Fetch run by slug/ID, with fallback to fixtures
  - `runAgain()` – Restart last run
  - `goHome()` – Reset to home screen
- Automatically polls `/api/stylemd/by-slug/{runId}` as fallback
- Persists results via POST `/api/stylemd/persist`

**GeneratePageContent.tsx**
- Client component that consumes SSE context
- Parses `?run=` query param and fetches the result
- Shows different screens:
  - `screen === "running"` → `<PipelineView />`
  - `screen === "result"` → `<FetchedRunDesignDetail />`
  - Loading spinner while fetching

---

## 3. STYLE.MD PAGE GENERATION & RENDERING

### What is Style.md?

A **style.md** is a markdown file with:
1. **Structured JSON block** (optional) wrapped in triple backticks:
   ```
   ```stylemd-ui
   {
     "version": 1,
     "brand": "Levain Bakery",
     "accentColor": "#e8006f",
     "description": "...",
     "fonts": [...],
     "palette": [...]
   }
   ```
   ```

2. **Plain markdown** (optional) after the JSON block with narrative design notes

### Style.md Generation Pipeline

1. **Backend** (separate service at `localhost:3002`) analyzes website
2. Returns markdown with JSON payload
3. Frontend extracts and displays it

### Frontend Rendering Process

**`extractStyleMdUi(md: string)`** (`stylemd-structured-view.ts`)
- Strips out the first `stylemd-ui` or `stylemd-json` code fence
- Parses JSON into `StyleMdUiPayload`
- Returns `{ payload, remainder }` (remainder is plain markdown)

**`renderStyleMdToHtml(md: string)`** (`stylemd-markdown-html.ts`)
- Calls `extractStyleMdUi()` to get structured data
- If `payload` exists: calls `renderStructuredDesignHtml(payload)`
- Renders plain markdown via `renderPlainStyleMd(remainder)`
- Returns combined HTML with separator (`<hr>`)

**`renderStructuredDesignHtml(payload)`** (`stylemd-structured-view.ts`, lines 127+)
- Generates a **rich, interactive HTML layout** with:
  - **Hero section** with brand, accent color, hero headline, tags
  - **Typography section**: Font cards (up to 4) with samples, weights, roles
  - **Palette section**: Color swatches with 10-shade gradients
  - **Spacing section**: Cards showing base rhythm, gaps, sections
  - **Elevation section**: Shadow and depth rules
  - **Shapes section**: Border radius and shape styles
  - **Motion section**: Animation timing and easing
  - **Guidelines section**: Dos and donts

**`renderPlainStyleMd(md: string)`** (`stylemd-markdown-html.ts`, lines 28+)
- Converts markdown to inline HTML
- Supports: headings (#-####), lists (*/-), code blocks, inline formatting (**bold**, *italic*, `code`)
- Uses CSS variables: `var(--text-primary)`, `var(--border-medium)`, etc.

### Display in UI

**FetchedRunDesignDetail.tsx** component:
1. Extracts `StyleMdUiPayload` using `extractStyleMdUi(run.styleMd)`
2. Converts to `DesignCard` using `styleMdUiPayloadToDesignCard(payload, opts)`
3. Renders via `<CatalogMainSections card={designCard} />` (in-app rich preview)
4. Also shows raw HTML with `dangerouslySetInnerHTML` for the full design guide

---

## 4. THE `/generate?run=levainbakery-2` ENDPOINT DETAILS

### What It Does

**URL:** `http://localhost:3000/generate?run=levainbakery-2`

This is a **deep-link** to view a previously generated run (or a demo fixture).

### Request Flow

```
1. User navigates to /generate?run=levainbakery-2
   ↓
2. GeneratePageContent.tsx mounts
   - Extracts searchParam: run = "levainbakery-2"
   - Calls viewRun("levainbakery-2")
   ↓
3. viewRun() in SSE context:
   a. First tries: GET /api/stylemd/by-slug/levainbakery-2
      (from backend API at localhost:3002)
   b. If API returns empty styleMd:
      - Calls fillRunWithFixtureMarkdownIfEmpty()
      - Tries to fetch fixture: GET /fixtures/stylemd/levainbakery-2-style.md
   c. If API returns nothing:
      - Calls fetchFixtureRun("levainbakery-2")
      - Loads static fixture from /public/fixtures/stylemd/levainbakery-2-style.md
   ↓
4. Fixture Lookup (fixture-runs.ts):
   FIXTURES = {
     "levainbakery": { slug: "levainbakery", sourceUrl: "https://levainbakery.com/", markdownPath: "/fixtures/stylemd/levainbakery-2-style.md" },
     "levainbakery-2": { slug: "levainbakery-2", sourceUrl: "https://levainbakery.com/", markdownPath: "/fixtures/stylemd/levainbakery-2-style.md" }
   }
   ↓
5. Constructs RunData object:
   {
     url: "https://levainbakery.com/",
     slug: "levainbakery-2",
     runId: "fixture-levainbakery-2",  // prefix "fixture-"
     styleMd: <fetched markdown>,
     screenshot: "",
     provider: "kimi",
     model: "local-fixture",
     status: "completed",
     createdAt: "1970-01-01T00:00:00.000Z"
   }
   ↓
6. dispatch({ type: "SET_RESULT", data })
   ↓
7. Screen shows FetchedRunDesignDetail with the loaded style.md
```

### Return Value Example

The endpoint returns/displays the **Levain Bakery design system**:

**Fixture file:** `/Users/gouthamsankar/Codes/stylemd-ui/fixtures/levainbakery-2-style.md`

**Content:**
```json
{
  "version": 1,
  "brand": "Levain Bakery",
  "accentColor": "#e8006f",
  "description": "Design system built around minimalism and modularity, using a clean, almost monochromatic palette with subtle greys, crisp typography (often their custom Inter-based font), and generous whitespace to keep the focus on content.",
  "heroHeadline": "Mother's Day is coming!",
  "tags": ["D2C", "Vibrant", "Warm", "Vintage"],
  "fonts": [
    { "name": "Platform", "sample": "Aa Bb", "role": "HEADING SYSTEM", "dark": true, "weights": "Medium" },
    { "name": "National", "sample": "Aa Bb", "role": "BODY SYSTEM", "dark": false, "weights": "Regular, Medium" }
  ],
  "palette": [
    { "name": "Primary", "hex": "#000000", "swatches": [10 grayscale shades] },
    { "name": "Secondary", "hex": "#e8006f", "swatches": [10 pink shades] },
    { "name": "Tertiary", "hex": "#2d2bb5", "swatches": [10 blue shades] },
    { "name": "Neutral", "hex": "#f9c74f", "swatches": [10 yellow shades] }
  ]
}
```

**Plus markdown narrative:**
```markdown
# Levain Bakery — narrative design notes

## Overview
This block is **plain markdown** after the structured `stylemd-ui` fence...

## Voice & tone
- Warm, celebratory, NYC-rooted.
- Short sentences in merchandising modules; longer copy only in stories.

## Components (summary)
- Primary CTA uses the **accent** pink at `#e8006f`.
- Cards use generous radius and soft shadows consistent with the palette rows above.
```

### UI Display Output

When rendered, the page shows:

1. **Hero section**: "Levain Bakery" with accent color `#e8006f`, headline "Mother's Day is coming!"
2. **Tags**: D2C, Vibrant, Warm, Vintage
3. **Typography**: 2 font cards (Platform for headings, National for body)
4. **Palette**: 4 color groups with 10-shade swatches each
5. **Design notes**: Markdown-rendered guidance below

---

## 5. BACKEND API ENDPOINTS (Referenced by Frontend)

**Base URL:** `http://localhost:3002` (configurable via `NEXT_PUBLIC_API_BASE`)

### Key Endpoints

| Endpoint | Method | Purpose | Returns |
|----------|--------|---------|---------|
| `/api/stylemd/runs` | GET | List all past runs | `{ ok: bool, summaries: RunSummary[] }` |
| `/api/stylemd/by-slug/{slugOrId}` | GET | Fetch a specific run by slug or ID | `{ ok: bool, data: RunData }` |
| `/api/stylemd-artifacts/run` | POST | Start a new generation run | `{ ok: bool, runId: string }` (or 409 if busy) |
| `/api/stylemd/persist` | POST | Save run results to DB | `RunData` |
| `/api/session/events` | GET (SSE) | Stream pipeline events | SSE stream of events |
| `/api/stylemd` | DELETE | Clear current run | (clears state) |
| `/api/scraped-data` | GET | Fetch scraped page content | `{ url, images, title }` |

### SSE Event Types

Events arrive as:
```json
{
  "type": "event",
  "payload": {
    "type": "stylemd_run_started|stylemd_stage_started|stylemd_stage_completed|stylemd_stage_failed|stylemd_action|stylemd_run_completed",
    ...
  }
}
```

---

## 6. FIXTURE SYSTEM (Offline Demo Data)

**Purpose:** Allow deep-links like `/generate?run=levainbakery-2` to work offline or when API is unavailable.

**Files:**
- `lib/fixture-runs.ts` – Fixture registry and loading logic
- `fixtures/levainbakery-2-style.md` – Levain Bakery demo markdown
- `/public/fixtures/stylemd/levainbakery-2-style.md` – Served to frontend

**How It Works:**

1. User visits `/generate?run=levainbakery-2`
2. Frontend tries API first: `GET /api/stylemd/by-slug/levainbakery-2`
3. If API fails or returns empty styleMd:
   - `fetchFixtureRun("levainbakery-2")` loads from `public/fixtures/`
   - Constructs a synthetic `RunData` with `runId: "fixture-levainbakery-2"`
4. Isomorphic flag: `isFixtureRunId(runId)` returns true if `runId.startsWith("fixture-")`
5. Fixture runs have disabled "Run Again" button (read-only demo)

---

## 7. KEY TYPES & INTERFACES

### Core Data Types (`lib/api-types.ts`)

**`RunData`** – Complete run result
```typescript
{
  url: string;           // Website URL that was analyzed
  slug: string;          // Human-readable slug (e.g., "levainbakery-2")
  runId: string;         // Unique ID (e.g., "uuid-..." or "fixture-...")
  styleMd: string;       // Generated markdown content
  screenshot: string;    // Screenshot path or data URL
  screenshotUrl?: string;// Full URL to screenshot
  showcaseUrl?: string;  // URL to rendered showcase page
  provider: Provider;    // "claude" | "kimi"
  model: string;         // Model name (e.g., "local-fixture")
  status: RunStatus;     // "pending" | "running" | "completed" | "failed" | ...
  createdAt: string;     // ISO timestamp
}
```

**`StyleMdUiPayload`** – Structured JSON from style.md
```typescript
{
  version?: number;
  brand: string;           // Brand/project name
  description?: string;    // Design system summary
  accentColor: string;     // Primary accent color (hex)
  heroHeadline?: string;   // Display headline
  logoUrl?: string;        // Brand logo image URL
  tags?: Array<string | { label: string }>;  // Categorical tags
  fonts: StyleMdUiFont[];  // Font definitions
  palette: StyleMdUiPaletteRow[];  // Color palettes
  spacing?: { cards, steps, rules };  // Spacing system
  elevation?: { intro, rows, chips };  // Shadow/elevation system
  shapes?: { intro, items, badge };    // Border radius/shapes
  motion?: { tags, bars, steps, badge }; // Animation system
  guidelines?: { intro, dos, donts };  // Design guidance
}
```

### React Context (`lib/sse-context.tsx`)

**`SSEContextValue`** extends `AppState` with methods:
```typescript
interface SSEContextValue {
  screen: Screen;              // "home" | "running" | "result"
  runs: RunSummary[];          // Past run history
  activeRun: ActiveRun | null; // Currently running pipeline
  resultData: RunData | null;  // Completed run
  isRunning: boolean;          // Pipeline active?
  networkError: string | null; // API error message
  runError: string | null;     // Pipeline error
  
  // Methods
  startRun(url: string, provider: Provider): Promise<void>;
  viewRun(slugOrId: string): Promise<void>;
  goHome(): void;
  runAgain(): Promise<void>;
  dismissNetworkError(): void;
}
```

---

## 8. CONFIGURATION & ENVIRONMENT

**`.env.local.example`:**
```
NEXT_PUBLIC_API_BASE=http://localhost:3002
```

**`lib/api-config.ts`:**
```typescript
export const API_BASE =
  typeof process.env.NEXT_PUBLIC_API_BASE === "string" && process.env.NEXT_PUBLIC_API_BASE.trim() !== ""
    ? process.env.NEXT_PUBLIC_API_BASE.trim()
    : process.env.NODE_ENV === "development"
      ? "http://localhost:3002"
      : "";
```

**Dev Mode:** Defaults to `http://localhost:3002`  
**Production:** Requires explicit `NEXT_PUBLIC_API_BASE` env var

---

## 9. DESIGN CARD SYSTEM (Catalog)

**Static Catalog** (`lib/design-cards.ts`):
- Hardcoded design card definitions
- Two cards: Levain Bakery & Spotify
- Used on `/styles` page to display curated design systems

**Dynamic Conversion** (`lib/stylemd-to-design-card.ts`):
- `styleMdUiPayloadToDesignCard(payload, opts)` – Converts `StyleMdUiPayload` to `DesignCard`
- Used to render generated runs with the same rich layout as catalog

**DesignCard Type:**
```typescript
{
  url: string;               // Website URL
  heroHeadline: string;      // Display headline
  id: string;                // Unique ID
  name: string;              // Brand name
  logo: string;              // Logo URL or first letter
  accentColor: string;       // Brand color
  tags: { label, color }[];  // Category tags
  desc: string;              // Description
  palette: { name, hex, swatches }[];  // Colors
  fonts: { name, sample, role, dark }[]; // Fonts
}
```

---

## 10. PAGE ROUTES & LAYOUTS

### Route Structure

```
/                          – Home (Hero, IntegrationLogos, StyleLibrary)
/styles                    – Design catalog browser
/styles/[slug]             – Design detail (static or generated)
/generate                  – Generation interface
/generate?run=<id>         – View generated run result
/generate/<slug>           – Pretty URL redirect
/style                     – Legacy (redirects to /styles)
/spotify                   – Example spotify demo page
```

### Root Layout (`app/layout.tsx`)
- Loads fonts (Magnetik, Manrope, Funnel Display)
- Global styles (`globals.css`)
- NextJS metadata

### Main Layout (`app/(main)/layout.tsx`)
- Route group for `/`, `/styles/*`, `/generate/*`
- Navbar & Footer wrapper
- Shared styling context

---

## 11. TECHNOLOGY STACK

**Runtime:**
- Next.js 14.0.0 (App Router)
- React 18.3.1
- TypeScript 5.4.5

**Styling:**
- Tailwind CSS 3.4.3
- PostCSS 8.4.38
- Custom CSS variables for theming

**UI Components:**
- lucide-react (for icons)
- Custom React components

**Linting:**
- ESLint 8.57.0
- eslint-config-next

**Build Scripts:**
```json
{
  "dev": "next dev",              // Run dev server on :3000
  "build": "next build",
  "postbuild": "node ./scripts/generate-empty-manifests.js",
  "start": "next start",
  "lint": "next lint"
}
```

---

## 12. SUMMARY TABLE

| Aspect | Details |
|--------|---------|
| **Frontend Port** | 3000 (Next.js) |
| **Backend Port** | 3002 (Express API) |
| **Deep-Link Example** | `/generate?run=levainbakery-2` |
| **Fixture Format** | Markdown with ```stylemd-ui JSON fence + narrative |
| **Rendering** | Structured JSON → Rich HTML + Plain Markdown |
| **State Management** | React Context (SSEContext) + SSE events |
| **Offline Support** | Bundled fixtures at `/public/fixtures/stylemd/` |
| **API Fallback** | Polls database, then loads fixtures if empty |
| **File Format** | style.md (design system markup) |

---

Generated: May 3, 2026
