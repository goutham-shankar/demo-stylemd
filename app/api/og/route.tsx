import { ImageResponse } from "next/og";
import { NextRequest } from "next/server";

export const runtime = "edge";

const COLORS = [
  "#635bff", "#0d9488", "#2563eb", "#7c3aed",
  "#d97706", "#059669", "#dc2626", "#0891b2",
];

function brandColor(str: string): string {
  const idx = str.split("").reduce((acc, c) => acc + c.charCodeAt(0), 0) % COLORS.length;
  return COLORS[idx];
}

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const title = searchParams.get("title") || "Design System";
  const host = searchParams.get("host") || "";
  const img = searchParams.get("img") || "";

  const accent = brandColor(host || title);
  const initial = (host || title).charAt(0).toUpperCase();

  return new ImageResponse(
    (
      <div
        style={{
          width: "1200px",
          height: "630px",
          display: "flex",
          flexDirection: "column",
          background: "#ffffff",
          fontFamily: "sans-serif",
        }}
      >
        {/* Top accent bar */}
        <div style={{ display: "flex", height: "8px", background: accent, width: "100%" }} />

        {/* Main body */}
        <div style={{ display: "flex", flex: 1, flexDirection: "row" }}>

          {/* Left: screenshot or colored swatch */}
          <div
            style={{
              display: "flex",
              width: "480px",
              flexShrink: 0,
              background: img ? "#000" : accent,
              alignItems: "center",
              justifyContent: "center",
              overflow: "hidden",
            }}
          >
            {img ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src={img}
                alt=""
                width={480}
                height={622}
                style={{ objectFit: "cover", objectPosition: "top", width: "100%", height: "100%" }}
              />
            ) : (
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  width: "120px",
                  height: "120px",
                  borderRadius: "24px",
                  background: "rgba(255,255,255,0.2)",
                  fontSize: "64px",
                  fontWeight: 900,
                  color: "#ffffff",
                }}
              >
                {initial}
              </div>
            )}
          </div>

          {/* Right: text content */}
          <div
            style={{
              display: "flex",
              flex: 1,
              flexDirection: "column",
              justifyContent: "space-between",
              padding: "56px 56px",
              background: "#ffffff",
            }}
          >
            {/* Site badge */}
            <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
              <div
                style={{
                  display: "flex",
                  width: "40px",
                  height: "40px",
                  borderRadius: "10px",
                  background: accent,
                  alignItems: "center",
                  justifyContent: "center",
                  color: "#fff",
                  fontSize: "20px",
                  fontWeight: 900,
                }}
              >
                {initial}
              </div>
              <span style={{ fontSize: "18px", color: "#6b7280", fontWeight: 600 }}>
                {host || title}
              </span>
            </div>

            {/* Title */}
            <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
              <div
                style={{
                  fontSize: "48px",
                  fontWeight: 900,
                  color: "#111827",
                  lineHeight: 1.1,
                  letterSpacing: "-0.02em",
                }}
              >
                {title}
              </div>
              <div style={{ fontSize: "20px", color: "#9ca3af", fontWeight: 500 }}>
                Design System · Colors · Typography
              </div>
            </div>

            {/* DesignProbe branding */}
            <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
              <div
                style={{
                  display: "flex",
                  width: "32px",
                  height: "32px",
                  borderRadius: "8px",
                  background: "#635bff",
                  alignItems: "center",
                  justifyContent: "center",
                  color: "#fff",
                  fontSize: "16px",
                  fontWeight: 900,
                }}
              >
                D
              </div>
              <span style={{ fontSize: "16px", color: "#9ca3af", fontWeight: 700, letterSpacing: "0.03em" }}>
                DesignProbe
              </span>
            </div>
          </div>
        </div>
      </div>
    ),
    { width: 1200, height: 630 }
  );
}
