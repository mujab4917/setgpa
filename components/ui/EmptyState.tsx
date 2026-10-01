/**
 * Illustration + message shown when a search finds nothing.
 *
 * A drawing does two things a line of grey text does not: it makes an empty
 * result feel handled rather than broken, and it gives the eye somewhere to
 * land before reading what to do next.
 *
 * Original inline SVG - no image file, nothing to download.
 */
export function EmptyState({
  title,
  message,
  children,
}: {
  title: string;
  message: string;
  /** Optional action, e.g. a WhatsApp link. */
  children?: React.ReactNode;
}) {
  return (
    <div className="animate-fade-up rounded-2xl border border-dashed border-ink-900/20 bg-white p-8 text-center">
      <svg
        aria-hidden="true"
        viewBox="0 0 120 100"
        className="mx-auto h-24 w-28"
        fill="none"
      >
        {/* Magnifier over an empty list */}
        <rect x="14" y="16" width="62" height="10" rx="5" fill="#e2e8f0" />
        <rect x="14" y="34" width="46" height="10" rx="5" fill="#eef2f7" />
        <rect x="14" y="52" width="54" height="10" rx="5" fill="#eef2f7" />
        <rect x="14" y="70" width="34" height="10" rx="5" fill="#f1f5f9" />

        <circle
          cx="84"
          cy="56"
          r="21"
          fill="#ffffff"
          stroke="#4a8a6d"
          strokeWidth="4"
        />
        <path
          d="M99 71 L110 82"
          stroke="#4a8a6d"
          strokeWidth="5"
          strokeLinecap="round"
        />
        {/* A small "nothing here" face inside the lens */}
        <path
          d="M77 52 h4 M87 52 h4 M78 64 q6 -5 12 0"
          stroke="#94a3b8"
          strokeWidth="3"
          strokeLinecap="round"
          fill="none"
        />
      </svg>

      <p className="mt-4 font-semibold text-ink-900">{title}</p>
      <p className="mx-auto mt-1 max-w-sm text-sm leading-relaxed text-ink-700">
        {message}
      </p>

      {children && <div className="mt-5">{children}</div>}
    </div>
  );
}
