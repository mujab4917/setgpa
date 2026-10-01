/**
 * TARGET RESULT CARD
 *
 * The visual, transparent-math result for the target GPA planner - shared by
 * both the embedded (per-university) and standalone versions so the two
 * never drift into different explanations of the same numbers.
 *
 * Three things a first-year student who has never heard "credit-weighted
 * average" actually needs, in order:
 *  1. The headline number, in large type, with a plain-language verdict.
 *  2. A visual line showing where they stand today, what they're asking for,
 *     and what it takes to get there - so "3.80" has a place to land instead
 *     of floating in isolation.
 *  3. The exact arithmetic, with their own numbers plugged in - not a
 *     formula in the abstract, the actual sum that produced this result.
 */

interface Props {
  current: number;
  completed: number;
  upcoming: number;
  target: number;
  scale: number;
  result: { required: number; possible: boolean; bestPossible: number };
}

export function TargetResultCard({ current, completed, upcoming, target, scale, result }: Props) {
  const requiredRounded = Math.ceil((result.required - 1e-10) * 100) / 100;
  const requiredForBar = Math.min(result.required, scale);
  const totalCredits = completed + upcoming;
  const targetQualityPoints = target * totalCredits;
  const currentQualityPoints = current * completed;
  const neededQualityPoints = Math.max(0, targetQualityPoints - currentQualityPoints);

  return (
    <div role="status" className="mt-5 space-y-5 rounded-2xl border border-violet-100 bg-white p-5 sm:p-6">
      {/* ---------- Headline ---------- */}
      {result.possible ? (
        <div>
          <p className="text-sm text-ink-700">Average GPA needed across your upcoming credits</p>
          <p className="mt-1 text-4xl font-bold tabular-nums text-violet-700 sm:text-5xl">
            {requiredRounded.toFixed(2)} <span className="text-base font-normal text-ink-700">/ {scale.toFixed(2)}</span>
          </p>
          <p className="mt-2 text-sm leading-relaxed text-ink-700">
            {result.required === 0
              ? "Your existing credits already put this target within reach, even with a 0.00 across the upcoming credits."
              : `That's achievable on your ${scale.toFixed(2)} scale.`}
          </p>
        </div>
      ) : (
        <div>
          <p className="text-lg font-semibold text-red-700">This target isn't reachable in this many credits.</p>
          <p className="mt-2 text-sm leading-relaxed text-ink-700">
            You'd need a {result.required.toFixed(2)} GPA, above your {scale.toFixed(2)} scale. Even with the
            highest possible GPA in every upcoming course, your CGPA would reach{" "}
            <strong className="font-semibold text-ink-900">{result.bestPossible.toFixed(2)}</strong>. Try a lower
            target, or spread it across more upcoming credit hours.
          </p>
        </div>
      )}

      {/* ---------- Visual scale line: current / required / target ---------- */}
      <div>
        <div className="relative h-2 rounded-full bg-cream-200">
          <div
            className={`absolute inset-y-0 left-0 rounded-full ${result.possible ? "bg-violet-400" : "bg-red-300"}`}
            style={{ width: `${Math.min(100, (requiredForBar / scale) * 100)}%` }}
          />
          <ScaleMarker position={current / scale} label="Now" colorClass="bg-slate-500" />
          <ScaleMarker position={target / scale} label="Target" colorClass="bg-brand-600" />
        </div>
        <div className="mt-6 flex justify-between text-xs text-ink-700">
          <span>0.00</span>
          <span>{scale.toFixed(2)} scale</span>
        </div>
      </div>

      {/* ---------- Transparent math ---------- */}
      <details className="rounded-xl border border-ink-900/10 bg-cream-100 p-4 text-sm" open>
        <summary className="cursor-pointer font-medium text-ink-900 marker:content-none">
          <span className="inline-flex items-center gap-1.5">
            Show the exact math
            <span aria-hidden="true">↓</span>
          </span>
        </summary>
        <ol className="mt-3 space-y-2 text-ink-700">
          <li>
            <strong className="font-medium text-ink-900">1. Quality points you need in total:</strong>{" "}
            {target.toFixed(2)} target &times; {totalCredits} total credits = {targetQualityPoints.toFixed(2)}
          </li>
          <li>
            <strong className="font-medium text-ink-900">2. Quality points you already have:</strong>{" "}
            {current.toFixed(2)} current &times; {completed} completed credits = {currentQualityPoints.toFixed(2)}
          </li>
          <li>
            <strong className="font-medium text-ink-900">3. Quality points still needed:</strong>{" "}
            {targetQualityPoints.toFixed(2)} &minus; {currentQualityPoints.toFixed(2)} = {neededQualityPoints.toFixed(2)}
          </li>
          <li>
            <strong className="font-medium text-ink-900">4. Spread across your upcoming credits:</strong>{" "}
            {neededQualityPoints.toFixed(2)} &divide; {upcoming} upcoming credits ={" "}
            <strong className="font-semibold text-violet-700">{result.required.toFixed(2)} GPA</strong>
          </li>
        </ol>
      </details>

      <p className="text-xs leading-relaxed text-ink-700">
        An estimate using credit-weighted averages. Repeat-course policies and your university&rsquo;s rounding
        rules may change the final result.
      </p>
    </div>
  );
}

export function ScaleMarker({
  position,
  label,
  colorClass,
}: {
  /** 0-1, clamped so a marker never renders outside the bar. */
  position: number;
  label: string;
  colorClass: string;
}) {
  const clamped = Math.max(0, Math.min(1, position));
  return (
    <div
      className="absolute top-1/2 flex -translate-x-1/2 -translate-y-1/2 flex-col items-center"
      style={{ left: `${clamped * 100}%` }}
    >
      <span className={`h-3.5 w-3.5 rounded-full border-2 border-white shadow ${colorClass}`} />
      <span className="mt-1.5 whitespace-nowrap text-[11px] font-medium text-ink-700">{label}</span>
    </div>
  );
}
