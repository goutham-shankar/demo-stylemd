/**
 * Lightweight markdown → HTML for in-app style.md preview (not full CommonMark).
 * Optional ```stylemd-ui JSON renders a rich layout (see stylemd-structured-view.ts).
 */

import { extractStyleMdUi, renderStructuredDesignHtml } from "./stylemd-structured-view";

export function escHtml(s: string): string {
  return s
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

function processInline(raw: string): string {
  let s = escHtml(raw);
  s = s.replace(/\*\*(.*?)\*\*/g, "<strong>$1</strong>");
  s = s.replace(/(?<!\*)\*(?!\*)(.+?)(?<!\*)\*(?!\*)/g, "<em>$1</em>");
  s = s.replace(
    /`([^`]+)`/g,
    '<code style="background:rgba(0,0,0,0.06);padding:1px 5px;border-radius:4px;font-size:0.85em">$1</code>',
  );
  return s;
}

/** Plain markdown fragments only (no structured fences — strip those before calling). */
export function renderPlainStyleMd(md: string): string {
  const lines = md.split("\n");
  const out: string[] = [];
  let inCodeBlock = false;
  let codeLang = "";
  let codeLines: string[] = [];
  let inList = false;

  const closeList = () => {
    if (inList) {
      out.push("</ul>");
      inList = false;
    }
  };

  for (const raw of lines) {
    if (raw.startsWith("```")) {
      if (inCodeBlock) {
        closeList();
        out.push(
          `<pre style="background:#1a1a1a;color:#d4d4d4;padding:14px 16px;border-radius:10px;overflow-x:auto;font-size:0.82em;margin:12px 0"><code class="language-${escHtml(codeLang)}">${escHtml(codeLines.join("\n"))}</code></pre>`,
        );
        inCodeBlock = false;
        codeLines = [];
        codeLang = "";
      } else {
        closeList();
        inCodeBlock = true;
        codeLang = raw.slice(3).trim();
      }
      continue;
    }
    if (inCodeBlock) {
      codeLines.push(raw);
      continue;
    }

    const trimmed = raw.trimEnd();

    if (/^#{4} /.test(trimmed)) {
      closeList();
      out.push(
        `<h4 style="font-family:'Magnetik',sans-serif;font-size:1em;font-weight:700;margin:16px 0 4px;color:var(--text-primary)">${processInline(trimmed.slice(5))}</h4>`,
      );
    } else if (/^#{3} /.test(trimmed)) {
      closeList();
      out.push(
        `<h3 style="font-family:'Magnetik',sans-serif;font-size:1.1em;font-weight:700;margin:20px 0 6px;color:var(--text-primary)">${processInline(trimmed.slice(4))}</h3>`,
      );
    } else if (/^#{2} /.test(trimmed)) {
      closeList();
      out.push(
        `<h2 style="font-family:'Magnetik',sans-serif;font-size:1.25em;font-weight:700;margin:24px 0 8px;color:var(--text-primary)">${processInline(trimmed.slice(3))}</h2>`,
      );
    } else if (/^# /.test(trimmed)) {
      closeList();
      out.push(
        `<h1 style="font-family:'Magnetik',sans-serif;font-size:1.5em;font-weight:700;margin:28px 0 10px;color:var(--text-primary)">${processInline(trimmed.slice(2))}</h1>`,
      );
    } else if (/^[-*] /.test(trimmed)) {
      if (!inList) {
        out.push('<ul style="margin:8px 0;padding-left:1.4em;list-style:disc">');
        inList = true;
      }
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
      out.push(
        `<p style="margin:4px 0;font-size:0.9em;color:var(--muted);line-height:1.6">${processInline(trimmed)}</p>`,
      );
    }
  }
  closeList();
  return out.join("");
}

export function renderStyleMdToHtml(md: string): string {
  const { payload, remainder } = extractStyleMdUi(md);
  const parts: string[] = [];

  if (payload) {
    parts.push(renderStructuredDesignHtml(payload));
  }

  if (remainder.trim()) {
    if (payload) {
      parts.push(
        '<hr style="border:none;border-top:1px solid var(--border-medium);margin:28px 0" />',
      );
    }
    parts.push(renderPlainStyleMd(remainder));
  }

  return parts.join("");
}
