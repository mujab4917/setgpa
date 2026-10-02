/**
 * Google Analytics 4 events, sent from the browser.
 *
 * `trackEvent` does nothing when Analytics is not loaded (local development,
 * Netlify previews, or a visitor with an ad blocker), so calling it can never
 * break a page.
 *
 * WHAT IS SENT - and what is not
 *   search               what a visitor typed into a search box (after a pause)
 *   search_no_results    a search that matched nothing: universities to add next
 *   search_result_click  which university they chose from the results
 *   calculate_gpa / calculate_cgpa   that a calculation was run, for which
 *                        university and how many rows were filled in
 *   copy_result / download_result_card
 * GPA and CGPA values themselves are never sent.
 *
 * Where to see them: Google Analytics -> Reports -> Engagement -> Events.
 */

type EventValue = string | number | boolean | undefined;

declare global {
  interface Window {
    gtag?: (command: "event", name: string, params?: Record<string, EventValue>) => void;
  }
}

export function trackEvent(name: string, params: Record<string, EventValue> = {}): void {
  if (typeof window === "undefined" || typeof window.gtag !== "function") return;
  window.gtag("event", name, params);
}
