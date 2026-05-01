export default function SpotifyPreview() {
  const GREEN = "#1ed760";
  const playlists = [
    { title: "Chill Hits", sub: "Kick back to the best new and recent chill hits", img: "https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?w=200&h=200&fit=crop&q=80" },
    { title: "RapCaviar", sub: "Music from the streets", img: "https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=200&h=200&fit=crop&q=80" },
    { title: "Today's Top Hits", sub: "Jung Kook is on top of the Hottest 50!", img: "https://images.unsplash.com/photo-1470225620780-dba8ba36b745?w=200&h=200&fit=crop&q=80" },
    { title: "Peaceful Piano", sub: "Relax and indulge with beautiful piano pieces", img: "https://images.unsplash.com/photo-1520523839897-bd0b52f945a0?w=200&h=200&fit=crop&q=80" },
    { title: "Hot Country", sub: "The hottest country songs right now", img: "https://images.unsplash.com/photo-1487180144351-b8472da7d491?w=200&h=200&fit=crop&q=80" },
    { title: "Mood Booster", sub: "Get happy with today's feel-good hits!", img: "https://images.unsplash.com/photo-1501386761578-eaa54b915bce?w=200&h=200&fit=crop&q=80" },
  ];

  const recentlyPlayed = [
    { name: "Liked Songs", detail: "Playlist · 482 songs", img: null, gradient: "linear-gradient(135deg,#4a0080,#1e003a)" },
    { name: "Daily Mix 1", detail: "Daily Mix", img: "https://images.unsplash.com/photo-1514320291840-2e0a9bf2a9ae?w=80&h=80&fit=crop&q=80", gradient: null },
    { name: "Discover Weekly", detail: "Playlist · Spotify", img: "https://images.unsplash.com/photo-1529518969858-8baa65152fc8?w=80&h=80&fit=crop&q=80", gradient: null },
    { name: "Release Radar", detail: "Playlist · Spotify", img: "https://images.unsplash.com/photo-1506157786151-b8491531f063?w=80&h=80&fit=crop&q=80", gradient: null },
  ];

  return (
    <div style={{ background: "#121212", color: "#fff", fontFamily: "system-ui, -apple-system, sans-serif", height: "100vh", display: "flex", flexDirection: "column", overflow: "hidden" }}>
      {/* App shell */}
      <div style={{ display: "flex", flex: 1, overflow: "hidden" }}>
        {/* Left sidebar */}
        <aside style={{ width: 240, background: "#000", flexShrink: 0, display: "flex", flexDirection: "column", padding: "24px 12px 0" }}>
          {/* Logo */}
          <div style={{ display: "flex", alignItems: "center", gap: 8, padding: "0 12px", marginBottom: 24 }}>
            <svg viewBox="0 0 24 24" width="32" height="32" fill={GREEN}>
              <path d="M12 0C5.4 0 0 5.4 0 12s5.4 12 12 12 12-5.4 12-12S18.66 0 12 0zm5.521 17.34c-.24.359-.66.48-1.021.24-2.82-1.74-6.36-2.101-10.561-1.141-.418.122-.779-.179-.899-.539-.12-.421.18-.78.54-.9 4.56-1.021 8.52-.6 11.64 1.32.42.18.479.659.301 1.02zm1.44-3.3c-.301.42-.841.6-1.262.3-3.239-1.98-8.159-2.58-11.939-1.38-.479.12-1.02-.12-1.14-.6-.12-.48.12-1.021.6-1.141C9.6 9.9 15 10.561 18.72 12.84c.361.181.54.78.241 1.2zm.12-3.36C15.24 8.4 8.82 8.16 5.16 9.301c-.6.179-1.2-.181-1.38-.721-.18-.601.18-1.2.72-1.381 4.26-1.26 11.28-1.02 15.721 1.621.539.3.719 1.02.419 1.56-.299.421-1.02.599-1.559.3z" />
            </svg>
            <span style={{ fontWeight: 700, fontSize: 16, letterSpacing: "-0.01em" }}>Spotify</span>
          </div>

          {/* Nav */}
          <nav style={{ display: "flex", flexDirection: "column", gap: 4, marginBottom: 24 }}>
            {[
              { label: "Home", active: true },
              { label: "Search", active: false },
              { label: "Your Library", active: false },
            ].map(({ label, active }) => (
              <div key={label} style={{ display: "flex", alignItems: "center", gap: 12, padding: "8px 12px", borderRadius: 4, cursor: "pointer", color: active ? "#fff" : "#b3b3b3", fontWeight: active ? 700 : 500, fontSize: 14, background: active ? "#282828" : "transparent" }}>
                {label}
              </div>
            ))}
          </nav>

          <hr style={{ borderColor: "#282828", margin: "0 12px 16px" }} />

          {/* Playlists */}
          <div style={{ overflowY: "auto", flex: 1, paddingBottom: 16 }}>
            {["Liked Songs", "Daily Mix 1", "Chill Hits", "RapCaviar", "Release Radar", "Discover Weekly", "Peaceful Piano", "Hot Country"].map((name) => (
              <div key={name} style={{ padding: "6px 12px", color: "#b3b3b3", fontSize: 13, cursor: "pointer", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>
                {name}
              </div>
            ))}
          </div>
        </aside>

        {/* Main content */}
        <main style={{ flex: 1, overflowY: "auto", background: "linear-gradient(to bottom, #1a3a1a 0%, #121212 30%)" }}>
          {/* Topbar */}
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "16px 24px", position: "sticky", top: 0, background: "rgba(18,18,18,0.7)", backdropFilter: "blur(12px)", zIndex: 10 }}>
            <div style={{ display: "flex", gap: 8 }}>
              <button style={{ width: 32, height: 32, borderRadius: "50%", background: "rgba(0,0,0,0.7)", border: "none", color: "#fff", cursor: "pointer", fontSize: 18 }}>‹</button>
              <button style={{ width: 32, height: 32, borderRadius: "50%", background: "rgba(0,0,0,0.7)", border: "none", color: "#fff", cursor: "pointer", fontSize: 18 }}>›</button>
            </div>
            <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
              <div style={{ background: "#000", borderRadius: 20, padding: "6px 16px", fontSize: 13, fontWeight: 600, cursor: "pointer" }}>Upgrade</div>
              <div style={{ width: 32, height: 32, borderRadius: "50%", background: "#535353", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 13, fontWeight: 700, cursor: "pointer" }}>U</div>
            </div>
          </div>

          <div style={{ padding: "0 24px 24px" }}>
            {/* Good evening */}
            <h1 style={{ fontSize: 28, fontWeight: 900, marginBottom: 20, marginTop: 8 }}>Good evening</h1>

            {/* Recently played grid */}
            <div style={{ display: "grid", gridTemplateColumns: "repeat(2, 1fr)", gap: 8, marginBottom: 40 }}>
              {recentlyPlayed.map((item) => (
                <div key={item.name} style={{ display: "flex", alignItems: "center", gap: 16, background: "#282828", borderRadius: 4, overflow: "hidden", cursor: "pointer", transition: "background 0.2s" }}>
                  {item.gradient ? (
                    <div style={{ width: 64, height: 64, flexShrink: 0, background: item.gradient }} />
                  ) : (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img src={item.img!} alt={item.name} style={{ width: 64, height: 64, flexShrink: 0, objectFit: "cover" }} />
                  )}
                  <div style={{ flex: 1, overflow: "hidden" }}>
                    <div style={{ fontWeight: 700, fontSize: 14, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>{item.name}</div>
                    <div style={{ fontSize: 11, color: "#b3b3b3", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>{item.detail}</div>
                  </div>
                  <div style={{ width: 48, height: 48, borderRadius: "50%", background: GREEN, display: "flex", alignItems: "center", justifyContent: "center", marginRight: 16, flexShrink: 0, fontSize: 20, opacity: 0 }}>▶</div>
                </div>
              ))}
            </div>

            {/* Made For You */}
            <h2 style={{ fontSize: 22, fontWeight: 900, marginBottom: 16 }}>Made For You</h2>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(160px, 1fr))", gap: 16, marginBottom: 40 }}>
              {playlists.map((p) => (
                <div key={p.title} style={{ background: "#181818", borderRadius: 8, padding: 16, cursor: "pointer" }}>
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={p.img} alt={p.title} style={{ width: "100%", aspectRatio: "1", objectFit: "cover", borderRadius: 4, marginBottom: 12, display: "block" }} />
                  <div style={{ fontWeight: 700, fontSize: 14, marginBottom: 4, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>{p.title}</div>
                  <div style={{ fontSize: 12, color: "#b3b3b3", display: "-webkit-box", WebkitLineClamp: 2, WebkitBoxOrient: "vertical", overflow: "hidden" }}>{p.sub}</div>
                </div>
              ))}
            </div>

            {/* Recently Played */}
            <h2 style={{ fontSize: 22, fontWeight: 900, marginBottom: 16 }}>Recently Played</h2>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(160px, 1fr))", gap: 16 }}>
              {[...playlists].reverse().map((p) => (
                <div key={`r-${p.title}`} style={{ background: "#181818", borderRadius: 8, padding: 16, cursor: "pointer" }}>
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={p.img} alt={p.title} style={{ width: "100%", aspectRatio: "1", objectFit: "cover", borderRadius: 4, marginBottom: 12, display: "block" }} />
                  <div style={{ fontWeight: 700, fontSize: 14, marginBottom: 4, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>{p.title}</div>
                  <div style={{ fontSize: 12, color: "#b3b3b3", display: "-webkit-box", WebkitLineClamp: 2, WebkitBoxOrient: "vertical", overflow: "hidden" }}>{p.sub}</div>
                </div>
              ))}
            </div>
          </div>
        </main>
      </div>

      {/* Now playing bar */}
      <footer style={{ height: 90, background: "#181818", borderTop: "1px solid #282828", display: "flex", alignItems: "center", padding: "0 16px", gap: 16, flexShrink: 0 }}>
        {/* Track info */}
        <div style={{ display: "flex", alignItems: "center", gap: 12, width: 220, flexShrink: 0 }}>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src="https://images.unsplash.com/photo-1514320291840-2e0a9bf2a9ae?w=56&h=56&fit=crop&q=80"
            alt="Now playing"
            style={{ width: 56, height: 56, borderRadius: 4, objectFit: "cover", flexShrink: 0 }}
          />
          <div style={{ overflow: "hidden" }}>
            <div style={{ fontSize: 13, fontWeight: 600, color: "#fff", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>Blinding Lights</div>
            <div style={{ fontSize: 11, color: "#b3b3b3", whiteSpace: "nowrap" }}>The Weeknd</div>
          </div>
          <div style={{ fontSize: 18, color: GREEN, flexShrink: 0, marginLeft: 4 }}>♥</div>
        </div>

        {/* Player controls */}
        <div style={{ flex: 1, display: "flex", flexDirection: "column", alignItems: "center", gap: 8 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 20 }}>
            <button style={{ background: "none", border: "none", color: "#b3b3b3", cursor: "pointer", fontSize: 16 }}>⇄</button>
            <button style={{ background: "none", border: "none", color: "#b3b3b3", cursor: "pointer", fontSize: 22 }}>⏮</button>
            <button style={{ width: 32, height: 32, borderRadius: "50%", background: "#fff", border: "none", color: "#000", cursor: "pointer", fontSize: 16, display: "flex", alignItems: "center", justifyContent: "center", fontWeight: 900 }}>▶</button>
            <button style={{ background: "none", border: "none", color: "#b3b3b3", cursor: "pointer", fontSize: 22 }}>⏭</button>
            <button style={{ background: "none", border: "none", color: "#b3b3b3", cursor: "pointer", fontSize: 16 }}>↺</button>
          </div>
          {/* Progress bar */}
          <div style={{ display: "flex", alignItems: "center", gap: 8, width: "100%", maxWidth: 500 }}>
            <span style={{ fontSize: 11, color: "#b3b3b3", width: 30, textAlign: "right" }}>1:23</span>
            <div style={{ flex: 1, height: 4, background: "#535353", borderRadius: 2, position: "relative" }}>
              <div style={{ width: "34%", height: "100%", background: GREEN, borderRadius: 2 }} />
            </div>
            <span style={{ fontSize: 11, color: "#b3b3b3", width: 30 }}>3:20</span>
          </div>
        </div>

        {/* Volume */}
        <div style={{ display: "flex", alignItems: "center", gap: 8, width: 160, justifyContent: "flex-end" }}>
          <span style={{ color: "#b3b3b3", fontSize: 16 }}>🔊</span>
          <div style={{ flex: 1, height: 4, background: "#535353", borderRadius: 2 }}>
            <div style={{ width: "70%", height: "100%", background: "#b3b3b3", borderRadius: 2 }} />
          </div>
        </div>
      </footer>
    </div>
  );
}
