import { SocialIcon } from "@/components/ui/icons";
import { socialLinks } from "@/lib/site-config";

/**
 * Row of circular social profile links.
 *
 * Entries with an empty href are skipped, so hiding a platform means clearing
 * its URL in lib/site-config.ts rather than editing this component.
 */
export function SocialLinks({
  className = "",
  variant = "light",
}: {
  className?: string;
  /** "light" for white/light backgrounds, "dark" for the dark footer bar. */
  variant?: "light" | "dark";
}) {
  const active = socialLinks.filter((link) => link.href.trim() !== "");
  if (active.length === 0) return null;

  const styles =
    variant === "dark"
      ? "border-white/20 text-slate-300 hover:border-white/40 hover:bg-white/10 hover:text-white"
      : "border-ink-900/10 text-ink-700 hover:border-brand-500 hover:bg-brand-50 hover:text-brand-700";

  return (
    <ul className={`flex items-center gap-2 ${className}`}>
      {active.map((link) => (
        <li key={link.name}>
          <a
            href={link.href}
            target="_blank"
            rel="noopener noreferrer"
            // The icon itself is aria-hidden, so the name lives here.
            aria-label={link.name}
            title={link.name}
            className={`flex h-9 w-9 items-center justify-center rounded-full border transition-colors ${styles}`}
          >
            <SocialIcon name={link.icon} />
          </a>
        </li>
      ))}
    </ul>
  );
}
