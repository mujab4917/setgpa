import { feedbackContent } from "@/data/site-content";
import { buildWhatsAppLink } from "@/lib/whatsapp";

interface WhatsAppContactProps {
  /** The pre-filled message. Build it with lib/whatsapp.ts helpers. */
  message: string;
  /** "card" for the full feedback block, "link" for a plain inline link. */
  variant?: "card" | "link";
  className?: string;
}

/**
 * WhatsApp feedback entry point.
 *
 * This is a Server Component: the link is just an anchor, so no JavaScript is
 * shipped to the browser for it. The number comes from the environment
 * variable NEXT_PUBLIC_WHATSAPP_NUMBER (see lib/site-config.ts).
 */
export function WhatsAppContact({
  message,
  variant = "card",
  className = "",
}: WhatsAppContactProps) {
  const href = buildWhatsAppLink(message);

  if (variant === "link") {
    if (!href) return null;
    return (
      <a
        href={href}
        target="_blank"
        rel="noopener noreferrer"
        className={`font-medium text-brand-700 underline underline-offset-2 hover:text-brand-800 ${className}`}
      >
        {feedbackContent.buttonLabel}
      </a>
    );
  }

  return (
    <section
      aria-labelledby="whatsapp-feedback-heading"
      className={`rounded-xl border border-brand-200 bg-brand-50 p-5 sm:p-6 ${className}`}
    >
      <h2
        id="whatsapp-feedback-heading"
        className="text-xl font-bold text-ink-900"
      >
        {feedbackContent.heading}
      </h2>
      <p className="mt-2 text-sm leading-relaxed text-ink-700">
        {feedbackContent.body}
      </p>

      {href ? (
        <a
          href={href}
          target="_blank"
          rel="noopener noreferrer"
          className="mt-4 inline-flex items-center justify-center rounded-lg bg-brand-600 px-5 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-brand-700"
        >
          {feedbackContent.buttonLabel}
        </a>
      ) : (
        <p className="mt-4 text-sm text-ink-700">
          {feedbackContent.notConfiguredLabel}
        </p>
      )}
    </section>
  );
}
