# Student experience update

The university page starts with a compact heading and the shared GPA/CGPA
calculator. Next come section shortcuts, the target GPA planner, a campus scene,
the grade table, university details, calculation explanations and FAQs.

The target planner uses `(target × (completed + upcoming) − current × completed)
/ upcoming`. It distinguishes attainable targets from targets above the campus
scale. Required GPA is rounded up to two decimals. Repeat-course replacement
rules are not modelled. Inputs remain local to the open page.

GPA and CGPA results can be downloaded as 1200 × 1000 PNG cards, rendered locally
with Canvas. Cards contain the university, calculation type, result, credit
totals and source page URL. They do not contain entered course names.

## Visuals and photo coverage

All 24 seeded cities receive original education-themed SVG artwork. Lahore and
Islamabad have landmark details and curated city photographs. All university
pages have a scene section; campuses without a curated photo use clearly labelled
city artwork. This is not a claim that every campus has been photographed.

The curated photograph manifest is `data/place-photos.ts`. Current photos cover
FAST Lahore, GCU Lahore, NUST Islamabad, Quaid-i-Azam University and Air University.
A FAST Islamabad mapping is available for that route if it is added to the data.
Other university-specific photographs are still outstanding.

Every photo record includes its Commons filename, author, caption and license
version. Each scene links to its original file and license, declares cropping and
the overlay, and licenses image adaptations under the same CC BY-SA terms.
The code and original illustrations are separate from these photo adaptations.

Photos are remotely fetched by Next Image, lazily loaded, sized for the viewport
and served in modern formats. The underlying illustration remains available if
an image fails. Bulk local photo downloads were unavailable in this environment;
the live FAST Lahore photo was successfully checked in the browser.

To add a photograph, verify the exact campus and reuse license from its source,
then add a record under `citySlug/universitySlug`. Do not use a different branch's
photograph as a campus photo. City photos belong in `cityPhotos`.

## Interaction and verification

- GPA is the default tab; forms remain mounted to retain values on tab changes.
- Arrow keys, Home and End navigate tabs. Touch targets have a 44px minimum.
- Campus motion uses CSS scroll timelines on desktop where supported; reduced
  motion and unsupported browsers get static scenes.
- Result panels stay in document flow so they do not cover mobile inputs.
- TypeScript passes. The calculation suite has 56 passing tests, including nine
  target-planner cases.
- Browser checks cover tab persistence, a reachable target, PNG export success,
  the campus photograph, and a narrow viewport without horizontal overflow.
- The installed browser extension injects `bis_skin_checked` attributes and
  triggers development hydration warnings. Those warnings are unrelated to the
  calculator state or the page's rendered layout.
