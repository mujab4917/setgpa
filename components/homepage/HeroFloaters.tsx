/**
 * Two decorative sample cards that float beside the hero headline on wide
 * screens. Purely illustrative - hidden from assistive tech and below xl.
 */
export function HeroFloaters() {
  return (
    <div aria-hidden="true" className="pointer-events-none absolute inset-0 hidden xl:block">
      <div
        className="absolute left-[2%] top-[22%] w-52 -rotate-3 rounded-2xl border border-ink-900/10 bg-white p-4 shadow-[var(--shadow-elevation-3)]"
        style={{ animation: "float-slow 7s ease-in-out infinite" }}
      >
        <p className="text-xs font-semibold text-ink-700">Sample semester</p>
        <p className="mt-1 font-[family-name:var(--font-display)] text-5xl font-extrabold leading-none text-ink-900">3.67</p>
        <div className="mt-3 h-2 overflow-hidden rounded-full bg-cream-200">
          <div className="h-full w-[92%] rounded-full bg-brand-500" />
        </div>
      </div>

      <div
        className="absolute right-[3%] top-[18%] flex h-24 w-24 rotate-6 items-center justify-center rounded-full border-4 border-terracotta-500 bg-white/80 font-[family-name:var(--font-display)] text-5xl font-extrabold text-terracotta-500 shadow-lg"
        style={{ animation: "float-slow 8s ease-in-out -2s infinite" }}
      >
        A-
      </div>

      <div
        className="absolute bottom-[12%] right-[6%] w-56 rotate-2 rounded-2xl bg-brand-700 p-4 text-white shadow-[var(--shadow-elevation-3)]"
        style={{ animation: "float-slow 9s ease-in-out -4s infinite" }}
      >
        <p className="text-xs font-semibold text-white/75">Needed next semester</p>
        <p className="mt-1 font-[family-name:var(--font-display)] text-4xl font-extrabold leading-none">3.85</p>
        <p className="mt-2 text-xs text-white/75">to reach a 3.50 CGPA</p>
      </div>
    </div>
  );
}
