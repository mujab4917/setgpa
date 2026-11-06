/** "2026-11-06" -> "6 November 2026". Fixed to UTC so the server and browser always agree. */
export function formatLongDate(iso: string): string {
  return new Intl.DateTimeFormat("en-GB", {
    day: "numeric",
    month: "long",
    year: "numeric",
    timeZone: "UTC",
  }).format(new Date(iso));
}
