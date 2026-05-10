import { useEffect } from "react";

/**
 * Known system / generic fonts — no need to hit Google Fonts for these.
 */
const SYSTEM_FONTS = new Set([
  "system-ui", "sans-serif", "serif", "monospace", "cursive", "fantasy",
  "ui-serif", "ui-sans-serif", "ui-monospace",
  // Common pre-installed fonts that Google Fonts won't have anyway
  "arial", "helvetica", "times new roman", "georgia", "trebuchet ms",
  "courier new", "verdana", "tahoma", "impact", "comic sans ms",
  "palatino", "garamond", "bookman", "avant garde",
]);

function toGoogleFontsParam(name: string): string {
  // Google Fonts expects spaces as "+" in the family param
  return name.trim().replace(/\s+/g, "+");
}

/**
 * Dynamically loads the given font names from Google Fonts.
 * If a font is not found on Google Fonts the <link> simply returns a 400
 * and the browser silently falls back to the next font in the CSS stack.
 *
 * @param fontNames  List of font family names extracted from the StyleMD
 */
export function useGoogleFonts(fontNames: string[]) {
  useEffect(() => {
    if (typeof document === "undefined") return;
    if (!fontNames.length) return;

    const toLoad = fontNames.filter((name) => {
      if (!name || name.length < 2) return false;
      return !SYSTEM_FONTS.has(name.toLowerCase());
    });

    if (!toLoad.length) return;

    const ids: string[] = [];

    for (const name of toLoad) {
      const id = `gfont-${name.toLowerCase().replace(/\s+/g, "-")}`;
      if (document.getElementById(id)) continue; // already injected

      // Preconnect (idempotent – only adds once)
      if (!document.getElementById("gfont-preconnect")) {
        const pre = document.createElement("link");
        pre.id = "gfont-preconnect";
        pre.rel = "preconnect";
        pre.href = "https://fonts.googleapis.com";
        document.head.appendChild(pre);

        const pre2 = document.createElement("link");
        pre2.rel = "preconnect";
        pre2.href = "https://fonts.gstatic.com";
        pre2.crossOrigin = "anonymous";
        document.head.appendChild(pre2);
      }

      const param = toGoogleFontsParam(name);
      const link = document.createElement("link");
      link.id = id;
      link.rel = "stylesheet";
      // Request regular (400) and bold (700) weights; display=swap prevents FOIT
      link.href = `https://fonts.googleapis.com/css2?family=${param}:wght@400;700&display=swap`;
      document.head.appendChild(link);
      ids.push(id);
    }

    // No cleanup — font links should persist for the page lifetime
  }, [fontNames.join(",")]); // re-run only when the list actually changes
}
