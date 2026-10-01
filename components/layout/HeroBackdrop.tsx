/**
 * Graph-paper backdrop for page heroes: a teal-tinted wash, clear ruling, one
 * slowly roaming glow and a butter-yellow blush, fading into the page colour
 * at the bottom edge. Decorative only, so it stays a Server Component.
 */
export function HeroBackdrop() {
  return (
    <div aria-hidden="true" className="pointer-events-none absolute inset-0 overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-br from-brand-200 via-brand-100 to-cream-100" />
      <div className="graph-paper absolute inset-0 !bg-transparent" />
      <div
        className="absolute -right-32 -top-40 h-[34rem] w-[34rem] rounded-full bg-brand-400/30 blur-3xl"
        style={{ animation: "glow-roam 20s ease-in-out infinite" }}
      />
      <div className="absolute -bottom-24 left-1/4 h-64 w-64 rounded-full bg-marker-300/40 blur-3xl" />
      <div className="absolute inset-x-0 bottom-0 h-20 bg-gradient-to-b from-transparent to-cream-100" />
    </div>
  );
}
