/**
 * Slow ticker of covered universities, rendered twice so the loop is seamless.
 * Pauses on hover. The duplicate copy is hidden from assistive tech.
 */
export function UniversityTicker({ names }: { names: string[] }) {
  if (names.length === 0) return null;
  const row = (hidden: boolean) => (
    <ul aria-hidden={hidden || undefined} className="flex shrink-0 items-center gap-10 pr-10">
      {names.map((name) => (
        <li
          key={`${hidden}-${name}`}
          className="whitespace-nowrap font-[family-name:var(--font-display)] text-xl font-semibold text-ink-900/70"
        >
          {name}
        </li>
      ))}
    </ul>
  );
  return (
    <div
      aria-label="Universities covered"
      className="marquee-pause overflow-hidden border-y border-ink-900/10 bg-white py-5"
      style={{ maskImage: "linear-gradient(to right, transparent, black 8%, black 92%, transparent)" }}
    >
      <div className="animate-marquee flex w-max">
        {row(false)}
        {row(true)}
      </div>
    </div>
  );
}
