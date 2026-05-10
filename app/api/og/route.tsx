import { ImageResponse } from "next/og";
import { NextRequest } from "next/server";

export const runtime = "edge";

function brandColor(str: string): string {
  const palette = [
    "#635bff", "#0d9488", "#2563eb", "#7c3aed",
    "#d97706", "#059669", "#dc2626", "#0891b2",
  ];
  const idx = str.split("").reduce((acc, c) => acc + c.charCodeAt(0), 0) % palette.length;
  return palette[idx];
}

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const title = searchParams.get("title") || "Design System";
  const host = searchParams.get("host") || "";
  const img = searchParams.get("img") || "";

  const bg = brandColor(host || title);

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
          overflow: "hidden",
          position: "relative",
        }}
      >
        {/* Screenshot background (if available) */}
        {img ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={img}
            alt=""
            style={{
              position: "absolute",
              inset: 0,
              width: "100%",
              height: "100%",
              objectFit: "cover",
              objectPosition: "top",
            }}
          />
        ) : (
          /* Fallback: colored gradient background */
          <div
            style={{
              position: "absolute",
              inset: 0,
              background: `linear-gradient(135deg, ${bg}22 0%, ${bg}08 100%)`,
            }}
          />
        )}

        {/* Dark overlay for readability */}
        <div
          style={{
            position: "absolute",
            inset: 0,
            background: img
              ? "linear-gradient(to top, rgba(0,0,0,0.85) 0%, rgba(0,0,0,0.3) 50%, rgba(0,0,0,0.1) 100%)"
              : "none",
          }}
        />

        {/* Content — bottom bar */}
        <div
          style={{
            position: "absolute",
            bottom: 0,
            left: 0,
            right: 0,
            padding: "40px 56px",
            display: "flex",
            flexDirection: "column",
            gap: "8px",
            background: img ? "none" : "linear-gradient(to top, rgba(0,0,0,0.06), transparent)",
          }}
        >
          {/* Site badge */}
          {host && (
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: "8px",
                marginBottom: "4px",
              }}
            >
              <div
                style={{
                  width: "32px",
                  height: "32px",
                  borderRadius: "8px",
                  background: bg,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  color: "#ffffff",
                  fontSize: "16px",
                  fontWeight: 900,
                }}
              >
                {host.charAt(0).toUpperCase()}
              </div>
              <span
                style={{
                  fontSize: "16px",
                  color: img ? "rgba(255,255,255,0.8)" : "#6b7280",
                  fontWeight: 600,
                }}
              >
                {host}
              </span>
            </div>
          )}

          <div
            style={{
              fontSize: img ? "44px" : "52px",
              fontWeight: 900,
              color: img ? "#ffffff" : "#111827",
              lineHeight: 1.1,
              letterSpacing: "-0.02em",
            }}
          >
            {title}
          </div>

          <div
            style={{
              fontSize: "20px",
              color: img ? "rgba(255,255,255,0.65)" : "#6b7280",
              fontWeight: 500,
              marginTop: "4px",
            }}
          >
            Design System · Colors · Typography · Components
          </div>

          {/* DesignProbe branding */}
          <div
            style={{
              marginTop: "20px",
              display: "flex",
              alignItems: "center",
              gap: "8px",
            }}
          >
            <div
              style={{
                width: "28px",
                height: "28px",
                borderRadius: "6px",
                background: "#635bff",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                color: "#fff",
                fontSize: "14px",
                fontWeight: 900,
              }}
            >
              D
            </div>
            <span
              style={{
                fontSize: "15px",
                fontWeight: 700,
                color: img ? "rgba(255,255,255,0.7)" : "#9ca3af",
                letterSpacing: "0.02em",
              }}
            >
              DesignProbe
            </span>
          </div>
        </div>
      </div>
    ),
    {
      width: 1200,
      height: 630,
    }
  );
}
