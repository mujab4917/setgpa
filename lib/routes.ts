/**
 * The one place where URL shapes are defined.
 * Change a URL structure here and every link in the app follows.
 */

export const routes = {
  home: () => "/",
  cities: () => "/cities",
  about: () => "/about",
  contact: () => "/contact",
  targetPlanner: () => "/target-gpa-calculator",
  guides: () => "/guides",
  howToCalculateGpa: () => "/guides/how-to-calculate-gpa",
  gpaVsCgpa: () => "/guides/gpa-vs-cgpa",
  city: (citySlug: string) => `/universities/${citySlug}`,
  university: (citySlug: string, universitySlug: string) =>
    `/universities/${citySlug}/${universitySlug}`,
  /**
   * The standalone Target GPA Calculator, pre-loaded for one university (and
   * optionally a starting CGPA / goal) - so a link from a university page or
   * a "what do you need next" prompt lands the student on a fully set-up
   * planner instead of an empty picker.
   */
  targetPlannerFor: (params: {
    citySlug: string;
    universitySlug: string;
    current?: number;
    target?: number;
  }) => {
    const query = new URLSearchParams({
      city: params.citySlug,
      university: params.universitySlug,
    });
    if (params.current !== undefined) query.set("current", params.current.toFixed(2));
    if (params.target !== undefined) query.set("target", params.target.toFixed(2));
    return `/target-gpa-calculator?${query.toString()}`;
  },
} as const;

/**
 * Pulls { citySlug, universitySlug } back out of a university page URL
 * (absolute or relative). Used where a component only has the page's share
 * URL on hand (e.g. a GPA result card) and needs to link into
 * routes.targetPlannerFor() for that same university.
 */
export function parseUniversityPath(url: string): { citySlug: string; universitySlug: string } | null {
  const match = url.match(/\/universities\/([^/]+)\/([^/?#]+)/);
  if (!match) return null;
  return { citySlug: match[1], universitySlug: match[2] };
}
