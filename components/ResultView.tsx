"use client";

import { useState, useCallback } from "react";
import { useRouter } from "next/navigation";
import { useSSE, API_BASE } from "@/lib/sse-context";

// ── Markdown renderer ─────────────────────────────────────────────────────────

function escHtml(s: string): string {
  return s
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

function processInline(raw: string): string {
  // Escape HTML first, then apply inline markup
  let s = escHtml(raw);
  // Bold **text**
  s = s.replace(/\*\*(.*?)\*\*/g, "<strong>$1</strong>");
  // Italic *text* (not inside **)
  s = s.replace(/(?<!\*)\*(?!\*)(.+?)(?<!\*)\*(?!\*)/g, "<em>$1</em>");
  // Inline code `text`
  s = s.replace(
    /`([^`]+)`/g,
    '<code style="background:rgba(0,0,0,0.06);padding:1px 5px;border-radius:4px;font-size:0.85em">$1</code>'
  );
  return s;
}

function renderMarkdown(md: string): string {
  const lines = md.split("\n");
  const out: string[] = [];
  let inCodeBlock = false;
  let codeLang = "";
  let codeLines: string[] = [];
  let inList = false;

  const closeList = () => {
    if (inList) { out.push("</ul>"); inList = false; }
  };

  for (const raw of lines) {
    if (raw.startsWith("```")) {
      if (inCodeBlock) {
        closeList();
        out.push(
          `<pre style="background:#1a1a1a;color:#d4d4d4;padding:14px 16px;border-radius:10px;overflow-x:auto;font-size:0.82em;margin:12px 0"><code class="language-${escHtml(codeLang)}">${escHtml(codeLines.join("\n"))}</code></pre>`
        );
        inCodeBlock = false; codeLines = []; codeLang = "";
      } else {
        closeList();
        inCodeBlock = true;
        codeLang = raw.slice(3).trim();
      }
      continue;
    }
    if (inCodeBlock) { codeLines.push(raw); continue; }

    const trimmed = raw.trimEnd();

    if (/^#{4} /.test(trimmed)) {
      closeList();
      out.push(`<h4 style="font-family:'Magnetik',sans-serif;font-size:1em;font-weight:700;margin:16px 0 4px;color:var(--text-primary)">${processInline(trimmed.slice(5))}</h4>`);
    } else if (/^#{3} /.test(trimmed)) {
      closeList();
      out.push(`<h3 style="font-family:'Magnetik',sans-serif;font-size:1.1em;font-weight:700;margin:20px 0 6px;color:var(--text-primary)">${processInline(trimmed.slice(4))}</h3>`);
    } else if (/^#{2} /.test(trimmed)) {
      closeList();
      out.push(`<h2 style="font-family:'Magnetik',sans-serif;font-size:1.25em;font-weight:700;margin:24px 0 8px;color:var(--text-primary)">${processInline(trimmed.slice(3))}</h2>`);
    } else if (/^# /.test(trimmed)) {
      closeList();
      out.push(`<h1 style="font-family:'Magnetik',sans-serif;font-size:1.5em;font-weight:700;margin:28px 0 10px;color:var(--text-primary)">${processInline(trimmed.slice(2))}</h1>`);
    } else if (/^[-*] /.test(trimmed)) {
      if (!inList) { out.push('<ul style="margin:8px 0;padding-left:1.4em;list-style:disc">'); inList = true; }
      out.push(`<li style="margin:3px 0;font-size:0.9em;color:var(--muted)">${processInline(trimmed.slice(2))}</li>`);
    } else if (/^\d+\. /.test(trimmed)) {
      closeList();
      out.push(`<p style="margin:4px 0;font-size:0.9em;color:var(--muted)">${processInline(trimmed)}</p>`);
    } else if (/^---+$/.test(trimmed)) {
      closeList();
      out.push('<hr style="border:none;border-top:1px solid var(--border-medium);margin:16px 0" />');
    } else if (trimmed === "") {
      closeList();
      out.push('<div style="height:8px"></div>');
    } else {
      closeList();
      out.push(`<p style="margin:4px 0;font-size:0.9em;color:var(--muted);line-height:1.6">${processInline(trimmed)}</p>`);
    }
  }
  closeList();
  return out.join("");
}

// ── Component ─────────────────────────────────────────────────────────────────

export default function ResultView() {
  const { resultData, goHome, runAgain, isRunning } = useSSE();
  const router = useRouter();
  const [tab, setTab] = useState<"preview" | "source" | "showcase">("preview");
  const [copied, setCopied] = useState(false);

  const handleGoHome = useCallback(() => {
    goHome();
    router.push("/");
  }, [goHome, router]);

  const handleCopy = useCallback(async () => {
    if (!resultData?.styleMd) return;
    try {
      await navigator.clipboard.writeText(resultData.styleMd);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch { /* ignore */ }
  }, [resultData?.styleMd]);

  if (!resultData) {
    return (
      <div className="flex items-center justify-center py-24">
        <div className="w-6 h-6 rounded-full border-2 border-t-transparent animate-spin"
          style={{ borderColor: "var(--cta)", borderTopColor: "transparent" }} />
      </div>
    );
  }

  let hostname = resultData.url;
  try { hostname = new URL(resultData.url).hostname; } catch { /* leave as-is */ }

  const showcaseUrl = resultData.showcaseUrl || `${API_BASE}/styleguide/${resultData.runId}`;

  return (
    <div className="w-full max-w-7xl mx-auto px-4 py-8">
      {/* Top bar: screenshot + meta + actions */}
      <div className="flex flex-col md:flex-row md:items-center gap-4 mb-6">
        {/* Screenshot thumbnail */}
        {resultData.screenshot && (
          <div className="flex-shrink-0">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={resultData.screenshot}
              alt={`Screenshot of ${hostname}`}
              className="w-32 h-20 object-cover rounded-xl border border-medium shadow-sm"
            />
          </div>
        )}

        {/* Meta */}
        <div className="flex-1 min-w-0">
          <h2 className="heading-h3 text-primary truncate">{hostname}</h2>
          <div className="flex items-center gap-2 mt-1 flex-wrap">
            <span className="px-2 py-0.5 rounded-md text-xs font-semibold border border-medium text-secondary bg-surface font-manrope uppercase tracking-wide">
              {resultData.provider}
            </span>
            {resultData.model && (
              <span className="text-xs text-secondary font-manrope">{resultData.model}</span>
            )}
            <span className="text-xs text-secondary font-manrope">
              {new Date(resultData.createdAt).toLocaleDateString()}
            </span>
          </div>
        </div>

        {/* Action buttons */}
        <div className="flex items-center gap-2 flex-wrap">
          <button
            type="button"
            onClick={handleGoHome}
            className="px-3 py-2 text-sm font-semibold font-manrope border border-medium rounded-xl text-secondary bg-surface hover:bg-[#f7f4ee] transition-all duration-150"
          >
            ← Back
          </button>
          <button
            type="button"
            onClick={handleCopy}
            className="px-3 py-2 text-sm font-semibold font-manrope border border-medium rounded-xl text-secondary bg-surface hover:bg-[#f7f4ee] transition-all duration-150"
          >
            {copied ? "Copied!" : "Copy style.md"}
          </button>
          <a
            href={showcaseUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="px-3 py-2 text-sm font-semibold font-manrope border border-medium rounded-xl text-secondary bg-surface hover:bg-[#f7f4ee] transition-all duration-150"
          >
            Open showcase ↗
          </a>
          <button
            type="button"
            onClick={async () => { await runAgain(); router.push("/generate"); }}
            disabled={isRunning}
            className="px-3 py-2 text-sm font-semibold font-manrope rounded-xl text-white transition-all duration-150 disabled:opacity-50"
            style={{ backgroundColor: "var(--cta)" }}
          >
            {isRunning ? "Running…" : "Run again"}
          </button>
        </div>
      </div>

      {/* Tab bar */}
      <div className="flex items-center gap-1 bg-surface border border-medium rounded-[12px] p-1 w-fit mb-5">
        {(["preview", "source", "showcase"] as const).map((t) => (
          <button
            key={t}
            type="button"
            onClick={() => setTab(t)}
            className={`px-4 py-1.5 rounded-[10px] text-sm font-semibold font-manrope transition-all duration-150 ${
              tab === t ? "bg-cta text-white" : "text-secondary hover:bg-[#f7f4ee]"
            }`}
          >
            {t === "preview" ? "style.md" : t === "source" ? "Source" : "Showcase"}
          </button>
        ))}
      </div>

      {/* Content */}
      {tab === "preview" && (
        <div className="bg-surface rounded-2xl border border-medium shadow-sm overflow-y-auto p-6 md:p-8"
          style={{ maxHeight: "70vh" }}>
          <div
            dangerouslySetInnerHTML={{ __html: renderMarkdown(resultData.styleMd) }}
          />
        </div>
      )}

      {tab === "source" && (
        <div className="bg-surface rounded-2xl border border-medium shadow-sm overflow-hidden"
          style={{ maxHeight: "70vh" }}>
          <pre
            className="overflow-auto p-6 text-xs leading-relaxed font-mono"
            style={{ color: "#d4d4d4", background: "#1a1a1a", maxHeight: "70vh" }}
          >
            {resultData.styleMd}
          </pre>
        </div>
      )}

      {tab === "showcase" && (
        <div className="bg-surface rounded-2xl border border-medium shadow-sm overflow-hidden"
          style={{ height: "70vh" }}>
          <iframe
            src={showcaseUrl}
            title={`Showcase for ${hostname}`}
            className="w-full h-full border-none"
            sandbox="allow-scripts allow-same-origin"
          />
        </div>
      )}
    </div>
  );
}
