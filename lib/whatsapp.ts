/**
 * Builds "click to chat" WhatsApp links.
 *
 * The number itself is never written in the code - it comes from
 * NEXT_PUBLIC_WHATSAPP_NUMBER (see .env.example and lib/site-config.ts).
 */

import { siteConfig } from "@/lib/site-config";
import { fillTemplate, whatsappMessages } from "@/data/site-content";

/** Placeholder value used in .env.example before you enter a real number. */
const PLACEHOLDER = "YOUR_WHATSAPP_NUMBER";

/** Keeps digits only: "+92 300 1234567" -> "923001234567". */
function normaliseNumber(raw: string): string {
  return raw.replace(/\D/g, "");
}

/** True when a usable number has been configured. */
export function isWhatsAppConfigured(): boolean {
  const raw = siteConfig.whatsappNumber.trim();
  if (raw === "" || raw === PLACEHOLDER) return false;
  return normaliseNumber(raw).length >= 8;
}

/** Builds a wa.me link with a pre-filled message. Returns null if not configured. */
export function buildWhatsAppLink(message: string): string | null {
  if (!isWhatsAppConfigured()) return null;
  const number = normaliseNumber(siteConfig.whatsappNumber);
  return `https://wa.me/${number}?text=${encodeURIComponent(message)}`;
}

/** Generic feedback message (footer, homepage). */
export function generalFeedbackMessage(): string {
  return whatsappMessages.general;
}

/** Feedback message pre-filled with the university the student is looking at. */
export function universityFeedbackMessage(
  universityName: string,
  cityName: string,
): string {
  return fillTemplate(whatsappMessages.university, {
    university: universityName,
    city: cityName,
  });
}
