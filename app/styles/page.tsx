import Link from "next/link";
import { designCards } from "@/lib/design-cards";

export default function StylesHome() {
  return (
    <main className="max-w-5xl mx-auto py-12 px-4">
      <h1 className="heading-h1 mb-4 text-primary">Style Library</h1>
      <p className="mb-10 text-lg text-secondary">Browse all available design systems and style guides. Click a card to view details and explore their palettes, typography, and more.</p>
      <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
        {designCards.map(card => (
          <Link key={card.id} href={`/styles/${card.id}`} className="group block rounded-2xl border border-light bg-surface p-7 shadow-sm hover:shadow-lg hover:border-dark transition-all duration-150">
            <div className="flex items-center gap-4 mb-3">
              <div className="w-12 h-12 rounded-xl flex items-center justify-center text-white font-black text-2xl shadow" style={{ background: card.accentColor }}>
                {typeof card.logo === 'string' && card.logo.startsWith('/') ? (
                  <img src={card.logo} alt={card.name} className="w-8 h-8 object-contain" />
                ) : (
                  card.logo
                )}
              </div>
              <span className="text-2xl font-bold text-primary group-hover:text-accent-blue transition-colors">{card.name}</span>
            </div>
            <div className="flex gap-2 flex-wrap mb-3">
              {card.tags.map(t => (
                <span key={t.label} className={`text-xs font-medium px-3 py-1 rounded-full border ${t.color}`}>{t.label}</span>
              ))}
            </div>
            <p className="text-sm text-secondary mb-2 line-clamp-2">{card.desc}</p>
            <div className="flex gap-1 mt-2">
              {card.palette.slice(0, 4).map((p, i) => (
                <span key={i} className="w-6 h-3 rounded-full border border-light" style={{ background: p.hex }} />
              ))}
            </div>
          </Link>
        ))}
      </div>
    </main>
  );
}
