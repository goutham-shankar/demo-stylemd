import Link from "next/link";

export default function NotFound() {
  return (
    <main className="relative flex min-h-screen items-center justify-center overflow-hidden bg-page px-4 py-16">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,#ffffff_0%,#f6f8fa_32%,#eef3f7_100%)]" />
      <div className="pointer-events-none absolute left-1/2 top-1/2 h-[28rem] w-[28rem] -translate-x-1/2 -translate-y-1/2 rounded-full bg-[radial-gradient(circle,rgba(64,117,255,0.18)_0%,rgba(64,117,255,0.08)_32%,transparent_70%)] blur-3xl animate-float-slow" />

      <div className="relative z-10 mx-auto w-full max-w-2xl text-center">
        <div className="mx-auto mb-8 flex h-24 w-24 items-center justify-center rounded-[28px] border border-medium bg-surface shadow-[0_30px_80px_rgba(15,23,42,0.08)] animate-card-float">
          <span className="font-funnel text-5xl font-bold tracking-tight text-primary">404</span>
        </div>

        <h1 className="heading-h1 mb-4 text-primary animate-fade-up">
          Page not found
        </h1>

        <p className="mx-auto mb-8 max-w-xl text-base leading-relaxed text-secondary font-manrope animate-fade-up-delay">
          The page you&apos;re looking for drifted out of orbit. Head back to the homepage or jump straight into the style library.
        </p>

        <div className="flex flex-col items-center justify-center gap-3 sm:flex-row animate-fade-up-delay-2">
          <Link
            href="/"
            className="inline-flex items-center justify-center rounded-[12px] bg-cta px-5 py-3 text-sm font-semibold text-white shadow-sm shadow-black/[0.12] transition-all duration-150 hover:opacity-90 hover:shadow-md"
          >
            Back to home
          </Link>
          <Link
            href="/styles"
            className="inline-flex items-center justify-center rounded-[12px] border border-medium bg-surface px-5 py-3 text-sm font-semibold text-primary transition-all duration-150 hover:bg-surface-soft hover:shadow-sm"
          >
            Browse styles
          </Link>
        </div>
      </div>

      <style>{`
        @keyframes floatSlow {
          0%, 100% { transform: translate(-50%, -50%) scale(1); }
          50% { transform: translate(-50%, -54%) scale(1.04); }
        }

        @keyframes cardFloat {
          0%, 100% { transform: translateY(0px); }
          50% { transform: translateY(-10px); }
        }

        @keyframes fadeUp {
          from { opacity: 0; transform: translateY(14px); }
          to { opacity: 1; transform: translateY(0); }
        }

        .animate-float-slow {
          animation: floatSlow 10s ease-in-out infinite;
        }

        .animate-card-float {
          animation: cardFloat 6s ease-in-out infinite;
        }

        .animate-fade-up {
          animation: fadeUp 700ms ease-out both;
        }

        .animate-fade-up-delay {
          animation: fadeUp 700ms ease-out 120ms both;
        }

        .animate-fade-up-delay-2 {
          animation: fadeUp 700ms ease-out 220ms both;
        }
      `}</style>
    </main>
  );
}