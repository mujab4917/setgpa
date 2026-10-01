/**
 * Province / territory for each city, used to group and filter the cities
 * directory. Kept in code (not the database) because it never changes; a city
 * that is not listed here simply falls under "Other".
 */

export const REGION_ORDER = [
  "Punjab",
  "Sindh",
  "Khyber Pakhtunkhwa",
  "Islamabad",
  "Balochistan",
  "Azad Kashmir",
  "Other",
] as const;

export type Region = (typeof REGION_ORDER)[number];

const CITY_REGION: Record<string, Region> = {
  lahore: "Punjab",
  rawalpindi: "Punjab",
  faisalabad: "Punjab",
  multan: "Punjab",
  gujrat: "Punjab",
  gujranwala: "Punjab",
  sialkot: "Punjab",
  sargodha: "Punjab",
  bahawalpur: "Punjab",
  sahiwal: "Punjab",
  "dera-ghazi-khan": "Punjab",
  "rahim-yar-khan": "Punjab",
  karachi: "Sindh",
  hyderabad: "Sindh",
  jamshoro: "Sindh",
  sukkur: "Sindh",
  larkana: "Sindh",
  peshawar: "Khyber Pakhtunkhwa",
  abbottabad: "Khyber Pakhtunkhwa",
  mardan: "Khyber Pakhtunkhwa",
  swat: "Khyber Pakhtunkhwa",
  islamabad: "Islamabad",
  quetta: "Balochistan",
  muzaffarabad: "Azad Kashmir",
};

export function getRegion(citySlug: string): Region {
  return CITY_REGION[citySlug] ?? "Other";
}
