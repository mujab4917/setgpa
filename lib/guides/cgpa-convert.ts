/**
 * CGPA <-> percentage conversion rules for the 10-point scale.
 *
 * There is NO single national rule. These are the three most common ones; the
 * guide tells students to use the rule their own university publishes. Shared
 * by the interactive converter and the tables in the article, so the two can
 * never disagree.
 */

export interface ConversionMethod {
  id: "cbse" | "vtu" | "x10";
  label: string;
  /** The rule in words, shown under the converter. */
  rule: string;
  toPercentage: (cgpa: number) => number;
  toCgpa: (percentage: number) => number;
}

export const conversionMethods: ConversionMethod[] = [
  {
    id: "cbse",
    label: "CBSE rule: CGPA × 9.5",
    rule: "Percentage = CGPA × 9.5. Published by CBSE for its 10-point grades and used by many colleges.",
    toPercentage: (cgpa) => cgpa * 9.5,
    toCgpa: (percentage) => percentage / 9.5,
  },
  {
    id: "vtu",
    label: "VTU rule: (CGPA − 0.75) × 10",
    rule: "Percentage = (CGPA − 0.75) × 10. Published by Visvesvaraya Technological University for its own students.",
    toPercentage: (cgpa) => (cgpa - 0.75) * 10,
    toCgpa: (percentage) => percentage / 10 + 0.75,
  },
  {
    id: "x10",
    label: "Simple rule: CGPA × 10",
    rule: "Percentage = CGPA × 10. A rough rule some institutions use. It always gives a higher figure than the CBSE rule.",
    toPercentage: (cgpa) => cgpa * 10,
    toCgpa: (percentage) => percentage / 10,
  },
];

export function getMethod(id: ConversionMethod["id"]): ConversionMethod {
  return conversionMethods.find((m) => m.id === id) ?? conversionMethods[0];
}

/** Rounds to 2 decimals without showing a pointless ".00" on whole numbers. */
export function formatNumber(value: number): string {
  const rounded = Math.round(value * 100) / 100;
  return Number.isInteger(rounded) ? String(rounded) : rounded.toFixed(2).replace(/0$/, "");
}
