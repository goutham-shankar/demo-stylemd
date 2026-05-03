import type { RunData } from "@/lib/api-types";

type FixtureDef = {
  slug: string;
  sourceUrl: string;
  markdownPath: string;
};

/**
 * Offline demo runs bundled under `public/fixtures/stylemd/` for deep-links like
 * `/generate?run=levainbakery-2` when the API returns nothing or is unavailable.
 */
const FIXTURES: Record<string, FixtureDef> = {
  levainbakery: {
    slug: "levainbakery",
    sourceUrl: "https://levainbakery.com/",
    markdownPath: "/fixtures/stylemd/levainbakery-2-style.md",
  },
  "levainbakery-2": {
    slug: "levainbakery-2",
    sourceUrl: "https://levainbakery.com/",
    markdownPath: "/fixtures/stylemd/levainbakery-2-style.md",
  },
};

const FIXTURE_RUN_ID_PREFIX = "fixture-";

export function isFixtureRunId(runId: string): boolean {
  return runId.startsWith(FIXTURE_RUN_ID_PREFIX);
}

function normalizeLookupKey(slugOrId: string): string {
  let s = slugOrId.trim().toLowerCase();
  if (s.startsWith(FIXTURE_RUN_ID_PREFIX)) {
    s = s.slice(FIXTURE_RUN_ID_PREFIX.length);
  }
  return s;
}

function resolveFixtureDef(slugOrId: string): FixtureDef | null {
  const key = normalizeLookupKey(slugOrId);
  return FIXTURES[key] ?? null;
}

/**
 * If the API returned a row with empty `styleMd` but this slug matches a bundled demo,
 * fill markdown from static assets so `/generate?run=levainbakery-2` works despite stale DB rows.
 */
export async function fillRunWithFixtureMarkdownIfEmpty(
  slugOrId: string,
  data: RunData,
  origin: string | undefined | null,
): Promise<RunData> {
  if (data.styleMd?.trim()) return data;
  if (!resolveFixtureDef(slugOrId)) return data;
  const fixture = await fetchFixtureRun(slugOrId, origin);
  if (!fixture?.styleMd.trim()) return data;
  const st = String(data.status ?? "");
  const terminal =
    st === "failed" ||
    st === "canceled" ||
    st === "completed" ||
    st === "completed_with_warnings";
  return {
    ...data,
    styleMd: fixture.styleMd,
    ...(terminal ? {} : { status: "completed" as const }),
  };
}

/**
 * Loads a synthetic completed run from static assets (same-origin fetch).
 */
export async function fetchFixtureRun(
  slugOrId: string,
  origin: string | undefined | null,
): Promise<RunData | null> {
  const def = resolveFixtureDef(slugOrId);
  if (!def) return null;

  const base = typeof origin === "string" && origin ? origin.replace(/\/$/, "") : "";
  const mdUrl = base ? `${base}${def.markdownPath}` : def.markdownPath;

  let styleMd = "";
  try {
    const res = await fetch(mdUrl, { cache: "force-cache" });
    if (!res.ok) return null;
    styleMd = await res.text();
  } catch {
    return null;
  }

  const runId = `${FIXTURE_RUN_ID_PREFIX}${def.slug}`;

  return {
    url: def.sourceUrl,
    slug: def.slug,
    runId,
    styleMd,
    screenshot: "",
    provider: "kimi",
    model: "local-fixture",
    status: "completed",
    createdAt: new Date(0).toISOString(),
  };
}
