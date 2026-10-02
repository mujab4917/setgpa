/**
 * ALL STATIC PAGE TEXT LIVES HERE.
 *
 * EDIT HERE to change headings, paragraphs, button labels and the WhatsApp
 * message templates. Nothing in this file is a component - it is plain data,
 * so you can change wording without touching React.
 *
 * Text that belongs to a specific city or university (descriptions, grading
 * notes, SEO titles) is NOT here - that lives in the database, see prisma/seed.ts.
 */

/**
 * Header navigation.
 * EDIT HERE to add, rename or reorder the links in the top bar.
 */
export const navContent = {
  links: [
    { label: "Home", href: "/" },
    { label: "Cities", href: "/cities" },
    { label: "Target GPA", href: "/target-gpa-calculator" },
    { label: "About", href: "/about" },
    { label: "Contact", href: "/contact" },
  ],
  /** Label on the WhatsApp button in the header. */
  ctaLabel: "WhatsApp",
} as const;

/**
 * THE ORDER CITIES APPEAR IN, and which ones the homepage features.
 *
 * EDIT HERE to change which cities lead the homepage. Slugs listed first come
 * first everywhere; any city not listed here is shown after them, in
 * alphabetical order. Nothing breaks if a slug here no longer exists.
 */
export const cityOrder = {
  /** Most-searched cities first. */
  priority: [
    "lahore",
    "karachi",
    "islamabad",
    "rawalpindi",
    "peshawar",
    "faisalabad",
    "multan",
    "gujrat",
    "quetta",
    "hyderabad",
    "sialkot",
    "gujranwala",
    "sargodha",
    "bahawalpur",
    "jamshoro",
    "abbottabad",
    "sukkur",
    "mardan",
    "swat",
    "sahiwal",
    "rahim-yar-khan",
    "dera-ghazi-khan",
    "larkana",
    "muzaffarabad",
  ] as string[],

  /** How many to show on the homepage before the "see all" link. */
  featuredCount: 6,
} as const;

/** The /cities page. */
export const citiesPageContent = {
  metaTitle: "GPA Calculator by City: Universities in Pakistan",
  metaDescription:
    "Choose your city to find your university's GPA and CGPA calculator. Browse every Pakistani city we cover, each university with its own grade table.",
  heading: "GPA calculators by city in Pakistan",
  intro:
    "Pick the city your campus is in to see the universities covered there. Every university has its own grade table, so the calculator you get matches the rules your department actually uses.",
  searchLabel: "Search for a city",
  searchPlaceholder: "Type a city name, e.g. Lahore",
  noResultsTitle: "No city matches that",
  noResults:
    "Try a shorter word. If your city is missing entirely, message us on WhatsApp and tell us which universities to add.",
} as const;

export const homeContent = {
  heroEyebrow: "Built for Pakistani students",
  heroHeading: "Pakistan University GPA & CGPA Calculator",
  heroSubheading:
    "Find your university and calculate your GPA or CGPA according to its own grading system.",
  heroIntro:
    "Every university in Pakistan uses a slightly different grade table. A grade that is worth 4.00 at one university may be worth 3.67 at another, so a generic calculator gives you the wrong number. This site keeps one grade table per university and feeds it into the same calculator, so the result matches the rules your own department uses.",

  citiesHeading: "Cities in Pakistan",
  citiesSubheading: "Find university GPA and CGPA calculators by city.",
  citiesEmptyMessage:
    "No cities are available yet. Please check back soon.",
  /** Link under the featured cities. {count} is the number not shown. */
  seeAllCitiesLabel: "See all {total} cities",
} as const;

/** Text for the university search box (homepage, city page, 404 page). */
export const searchContent = {
  label: "Search for your university",
  placeholder: "Type a university or city, e.g. FAST or Lahore",
  noResults:
    "No university matches that. Try a shorter word, or message us on WhatsApp and we will add it.",
  openLabel: "Open",
  keyboardHint: "Use ↑ ↓ to move through results, Enter to open.",
} as const;

/**
 * The "Plan your next move" teaser card on every university page
 * (components/calculators/TargetGpaTeaser.tsx). Not a calculator itself -
 * just a strong, specific reason to click through to the full Target GPA
 * Calculator, already pre-loaded for that university.
 */
export const targetTeaserContent = {
  eyebrow: "Plan your next move",
  heading: "Know your GPA. Now find out what it takes.",
  body:
    "Set a CGPA goal - safely above probation, comfortably average, or scholarship-worthy - and get the exact grades you need, calculated on {university}'s own grade table.",
  ctaLabel: "Plan my target GPA for {university}",
  hint: "Takes less than a minute. Nothing is saved or shared.",
} as const;

/**
 * The standalone Target GPA Calculator page -> /target-gpa-calculator.
 *
 * This page works on any scale, so it can rank for its own searches ("target
 * GPA calculator", "what GPA do I need") instead of only ever being found
 * through a specific university's calculator.
 */
export const targetPlannerPageContent = {
  metaTitle: "Target GPA Calculator: What GPA Do You Need?",
  metaDescription:
    "Free target GPA calculator. Enter your current CGPA, credits done and goal to see the GPA you need next semester, on a 4.00, 4.30, 5.00 or 10.00 scale.",
  eyebrow: "Plan your next move",
  heading: "Target GPA Calculator",
  intro:
    "Set the CGPA you're aiming for, and this works out the exact GPA you need across your upcoming credits to get there - on whatever scale your university uses.",

  howItWorksHeading: "How this calculator works",
  howItWorksSteps: [
    {
      title: "Pick your scale",
      description: "Match it to your university's grading scale - 4.00, 4.30, 5.00, 10.00, or your own.",
    },
    {
      title: "Enter where you stand",
      description: "Your current CGPA and how many credit hours you've completed so far.",
    },
    {
      title: "Set your target",
      description: "Your upcoming credit hours and the CGPA you want to reach.",
    },
    {
      title: "Get your number",
      description: "The exact average GPA you need across those upcoming credits - and whether it's realistic.",
    },
  ],

  formLabel: "Grading scale",
  scalePresets: [4.0, 4.3, 5.0, 10.0, 100],
  customScaleLabel: "Other",

  /** Shown above the university picker on the standalone page. */
  universityPickerHeading: "Search your university for its real grade table",
  universityPickerBody:
    "Find your university below to plan with its actual letter grades - not just a scale number. Don't see it, or not sure yet? Pick a scale manually instead.",
  scaleFallbackToggle: "I'll pick a scale manually instead",
  changeUniversityLabel: "Change university",

  modeHeading: "How do you want to plan?",
  modeOptions: [
    {
      key: "average",
      label: "One overall average",
      description: "Just tell me the single average GPA I need across everything upcoming.",
    },
    {
      key: "perCourse",
      label: "Course by course",
      description: "List my actual upcoming courses and tell me what each one needs.",
    },
  ],

  perCourse: {
    heading: "Your upcoming courses",
    intro:
      "List the courses you still have left. Leave a grade as \"Not decided yet\" to let the plan work out an average for it, or lock in a grade you already expect - the plan recalculates what's left, live.",
    addCourseLabel: "Add course",
    courseNamePlaceholder: "Course",
    gradeOpenOption: "Not decided yet",
    openBadge: "Needs",
    lockedBadge: "Locked in",
  },

  presetsHeading: "Or start from a common goal",
  presetsSubheading: "Skip the guesswork - pick where you want to land and we'll set the target for you.",
  presets: [
    {
      key: "probation",
      label: "Avoid probation",
      tag: "Safety net",
      icon: "shield",
      tone: "amber",
      ratio: 0.5,
      description: "The floor most Pakistani universities use before academic probation kicks in.",
    },
    {
      key: "good",
      label: "Solid standing",
      tag: "Steady path",
      icon: "trendingUp",
      tone: "blue",
      ratio: 0.75,
      description: "A comfortably average-or-better CGPA most departments are glad to see.",
    },
    {
      key: "scholarship",
      label: "Scholarship / Dean's list",
      tag: "Reach goal",
      icon: "star",
      tone: "emerald",
      ratio: 0.925,
      description: "The range that commonly qualifies for merit scholarships or the Dean's honour list.",
    },
  ],
  presetsDisclaimer:
    "These are typical bands, not your university's official policy - the real cutoff is in your student handbook, and it varies by school.",

  glossaryHeading: "Quick glossary",
  glossary: [
    { term: "GPA", definition: "Grade Point Average - the credit-weighted average of your grades for one semester." },
    { term: "CGPA", definition: "Cumulative GPA - the credit-weighted average of every semester so far, combined." },
    {
      term: "Credit hour",
      definition:
        "The \"weight\" a course carries, usually 3 or 4. A 3-credit course counts three times as much toward your average as a 1-credit course.",
    },
    {
      term: "Quality points",
      definition: "A course's credit hours multiplied by its grade point - the building block GPA and CGPA are both built from.",
    },
  ],

  worked: {
    heading: "Worked examples",
    /** {current}/{completed}/{upcoming}/{target}/{scale}/{required} filled in from lib/calculators/target.ts, not typed by hand, so it can never drift out of sync with the calculator above. */
    template:
      "A student with a {current} CGPA after {completed} credit hours, aiming for a {target} CGPA over the next {upcoming} credit hours on a {scale} scale, needs a {required} GPA this semester.",
  },
  workedExamples: [
    { heading: "Raising a low CGPA", current: 2.8, completed: 60, upcoming: 15, target: 3.0, scale: 4.0 },
    { heading: "Protecting a high CGPA", current: 3.8, completed: 90, upcoming: 15, target: 3.7, scale: 4.0 },
    { heading: "Starting from your very first semester", current: 0, completed: 0, upcoming: 16, target: 3.5, scale: 4.0 },
  ],

  examplesHeading: "A few common targets",

  faqHeading: "Target GPA calculator: frequently asked questions",
  faq: [
    {
      question: "How do I calculate the GPA I need to raise my CGPA?",
      answer:
        "Multiply your target CGPA by your total credit hours (completed plus upcoming), subtract your current CGPA multiplied by your completed credit hours, then divide by your upcoming credit hours. That gives the average GPA you need across every course still ahead of you. This calculator does that arithmetic for you and rounds up to two decimals, since your university will treat anything below the exact figure as short of the target.",
    },
    {
      question: "What does it mean if the required GPA is above my scale?",
      answer:
        "It means the target isn't reachable in the credit hours you gave it - even a perfect GPA in every upcoming course wouldn't get you there. The calculator shows the best CGPA you could still reach with a perfect run, so you can see how close you'd get and decide whether to extend the timeline (more upcoming credits) or adjust the target.",
    },
    {
      question: "Does this work for any GPA scale?",
      answer:
        "Yes. Pick 4.00, 4.30, 5.00 or 10.00 to match your university, or enter your own scale if your department uses something else. The formula is the same either way - only the ceiling changes.",
    },
    {
      question: "What's the difference between GPA and CGPA in this calculator?",
      answer:
        "GPA here means your average for the upcoming stretch of courses - the number this tool solves for. CGPA is your cumulative average across everything, before and after. \"Current CGPA\" is what your transcript shows today; \"Target CGPA\" is what you want your transcript to show once the upcoming credits are added in.",
    },
    {
      question: "Can I use this before I've finished a single semester?",
      answer:
        "Yes - enter 0 for both your current CGPA and completed credit hours. The calculator then simply tells you the average GPA you need across your very first stretch of courses to open at your target CGPA.",
    },
    {
      question: "Is a target GPA calculator accurate?",
      answer:
        "It is an exact credit-weighted average, not an estimate - the same arithmetic your university's own transcript system uses. The only thing it cannot know is your university's specific rounding policy or how repeat courses are treated, so treat the result as accurate to two decimals and confirm anything borderline with your own department.",
    },
    {
      question: "What's the difference between the \"one overall average\" and \"course by course\" modes?",
      answer:
        "The overall average mode gives you one number: the average GPA you need across all your upcoming credit hours combined. Course-by-course lets you list your actual courses and, if you already expect a grade in one of them, lock it in - the plan then recalculates what the remaining courses need to still reach your target, in real time.",
    },
    {
      question: "Where do the scholarship, good-standing and probation numbers come from?",
      answer:
        "They're typical bands seen across Pakistani universities (roughly the top 7-8% for scholarships, a comfortable average around 75% of the scale, and a floor around half the scale before probation), not a specific university's official policy. Always check your own handbook for the exact cutoff - this is a starting point, not a substitute.",
    },
  ],

  findUniversityHeading: "Want the calculator set up for your own university?",
  findUniversityBody:
    "This page works on any scale you enter by hand, or search your university above for its real grade table. Every university page on this site already has this same target planner built in, pre-filled to the right scale.",
} as const;

/** "Other universities in <city>" block at the bottom of a university page. */
export const relatedContent = {
  heading: "Other universities in {city}",
  linkLabel: "Open calculator",
  seeAllLabel: "See all universities in {city}",
} as const;

/** FAQ block on the university page. The questions themselves are generated
 *  from each university's own data - see lib/seo/faq.ts. */
export const faqContent = {
  heading: "Frequently asked questions",
} as const;

/** Labels for the calculator result panel. */
export const resultContent = {
  copyLabel: "Copy result",
  copiedLabel: "Copied",
  percentageLabel: "Percentage (approx.)",
  /** Tiny label inside the progress ring, under the percentage. */
  approxLabel: "approx",
  /**
   * Honest note about the conversion. A letter grade covers a band of marks,
   * so the original percentage cannot be recovered from a GPA - the
   * university's own figure comes from actual marks and will differ slightly.
   */
  percentageNote:
    "Percentage is converted from your GPA (GPA ÷ scale × 100). Your university calculates its own percentage from actual marks, so the two differ by a little.",
  copyFailed:
    "Your browser blocked copying. Select the numbers above and copy them manually.",
  /** "Plan your next move" links shown once a result exists, using this result as a starting CGPA. */
  targetCtaHeading: "What do you need next?",
  targetCtaCaption: "Using this as your current CGPA",
} as const;

export const cityPageContent = {
  /** Shown above the university list. {city} is replaced with the city name. */
  universitiesHeading: "Universities in {city}",
  universitiesEmptyMessage:
    "No universities have been added for this city yet. Message us on WhatsApp and tell us which one to add first.",
} as const;

/** The filterable university list on a city page. */
export const universityListContent = {
  filterAll: "All",
  filterVerified: "Verified",
  filterDemo: "Demo data",
  emptyTitle: "Nothing to show",
  emptyMessage:
    "No university here matches that filter yet. Switch back to All to see the full list.",
} as const;

export const universityPageContent = {
  gradingHeading: "GPA / CGPA grading system",
  gradingTableCaption: "Grade table used by this university",
  gradeColumnLabel: "Grade",
  marksColumnLabel: "Marks",
  gradePointColumnLabel: "Grade point",

  howGpaWorksHeading: "How GPA is calculated",
  howGpaWorksDefaultText:
    "Each course gives you quality points: multiply the course credit hours by the grade point of the grade you got. Add the quality points of all your courses, then divide by the total credit hours of those courses. The result is your semester GPA.",
  gpaFormula: "GPA = Sum of (Credit Hours x Grade Points) / Total Credit Hours",

  howCgpaWorksHeading: "How CGPA is calculated",
  howCgpaWorksDefaultText:
    "CGPA covers your whole degree so far, not just one semester. Multiply each semester's GPA by the credit hours you took in that semester to get that semester's quality points. Add the quality points of every semester, then divide by the total credit hours of every semester.",
  cgpaFormula:
    "CGPA = Total Quality Points across semesters / Total Credit Hours across semesters",

  gpaCalculatorHeading: "GPA calculator",
  gpaCalculatorIntro:
    "Add one row per course for the current semester, then calculate.",
  cgpaCalculatorHeading: "CGPA calculator",
  cgpaCalculatorIntro:
    "Add one row per completed semester, then calculate your cumulative CGPA.",

  basicInfoHeading: "University information",
  knownForLabel: "Known for:",
  cityLabel: "City",
  campusLabel: "Campus",
  establishedLabel: "Established",
  sectorLabel: "Sector",
  typeLabel: "Focus",
  websiteLabel: "Official website",
  scaleLabel: "GPA scale",

  /**
   * Small note at the bottom of a university page.
   * Kept to one calm sentence on purpose - see DataQualityNotice.tsx.
   */
  dataNotice:
    "Grading rules here are collected from university sources and kept up to date by hand. Universities do update their rules, and some departments differ, so check anything important against your own handbook. Spotted something wrong?",
  verifiedNoticePrefix: "Checked against:",
} as const;

export const feedbackContent = {
  heading: "Can't find your university, or found something wrong?",
  body:
    "Tell us which university to add next, or report a grading rule that does not match your handbook. We update the data by hand.",
  buttonLabel: "Message us on WhatsApp",
  /** Shown instead of the button when NEXT_PUBLIC_WHATSAPP_NUMBER is not set. */
  notConfiguredLabel:
    "WhatsApp contact is not configured yet (set NEXT_PUBLIC_WHATSAPP_NUMBER in .env).",
} as const;

/**
 * Pre-filled WhatsApp messages.
 * {university} and {city} are replaced with real values where available.
 */
export const whatsappMessages = {
  general:
    "Hello, I want to suggest an update to the university GPA/CGPA calculator website.",
  university:
    "Hello, I want to suggest an update for {university} ({city}) on the GPA/CGPA calculator website.",
  missingUniversity:
    "Hello, my university is missing from the GPA/CGPA calculator website. Please add: ",
} as const;

/**
 * About page. Its purpose is trust: it tells students who runs the site, where
 * the grading data comes from and how honest it is about its own limits.
 */
export const aboutContent = {
  /** How a grade table gets onto the site: a real sequence, so it is numbered. */
  stepsHeading: "How a grade table gets onto the site",
  steps: [
    {
      title: "Collect",
      body: "Grading rules are taken from university handbooks, academic regulations and student transcripts.",
    },
    {
      title: "Enter by hand",
      body: "Each rule is typed in per university, so one campus never changes another's grade table.",
    },
    {
      title: "Mark as unverified",
      body: "Until it is checked, the university page shows a clear notice that the table is demo data.",
    },
    {
      title: "Verify and name the source",
      body: "Once a table is checked against an official document, the notice is replaced by the source.",
    },
  ],
  principlesHeading: "What SetGPA stands for",
  principles: [
    { title: "One grade table per university", body: "No national average that does not exist." },
    { title: "Free, with no account", body: "Nothing you enter is saved or shared." },
    { title: "Honest about its data", body: "Every page says whether its table is verified." },
  ],

  metaTitle: "About Our GPA Calculator and Grading Data",
  metaDescription:
    "Who runs this GPA and CGPA calculator, where each university's grading data comes from, how it is checked, and what the site does not do.",
  heading: "About this site",
  intro:
    "This is an independent student project. It exists because a generic GPA calculator gives Pakistani students the wrong number: every university sets its own grade table, so the same letter grade can be worth different grade points depending on where you study.",
  sections: [
    {
      heading: "What the site does",
      body: "It keeps one grade table per university and feeds that table into the same calculator. You choose your city, then your university, and the calculator you get uses the grade points recorded for your own campus rather than a national average that does not exist.",
    },
    {
      heading: "Where the data comes from",
      body: "Grading rules are entered by hand from university handbooks, academic regulations and student transcripts. Every university starts marked as unverified, and its page shows a clear notice saying so, until the rules have been checked against an official source. When a university has been checked, its page names the source instead.",
    },
    {
      heading: "What it is not",
      body: "This site is not affiliated with, endorsed by, or operated by any university. It does not issue transcripts and it cannot tell you your official result. Use it to plan and to check your own arithmetic, then confirm anything that matters with your department.",
    },
    {
      heading: "How you can help",
      body: "The fastest way to make the data correct is for students to report what they know. If a grade table on this site does not match your handbook, or your university is missing, send a message on WhatsApp. Corrections that come with a source get applied first.",
    },
  ],
} as const;

/** Contact page. Deliberately just WhatsApp - no form, no inbox to maintain. */
export const contactContent = {
  metaTitle: "Contact Us: Report a Grade Table or Add a University",
  metaDescription:
    "Report an incorrect grading rule, ask for your university to be added to the GPA and CGPA calculator, or send us a suggestion.",
  heading: "Contact",
  intro:
    "Two ways to reach this site: WhatsApp or email. There is no contact form, because a message you can send in five seconds from your phone gets answered and a form does not.",
  emailHeading: "Prefer email?",
  emailBody:
    "Useful when you want to attach a scan of your handbook or a transcript page. Those are the corrections that get applied fastest.",
  emailSubject: "GPA calculator website - correction or suggestion",
  followHeading: "Follow the project",
  reasonsHeading: "Good reasons to message",
  reasons: [
    "A grading rule here does not match your university handbook.",
    "Your university or campus is missing and you want it added.",
    "A university page has the wrong campus, website or description.",
    "The calculator gave a result you think is wrong.",
    "You have a suggestion that would make the site more useful.",
  ],
  /**
   * The three things people usually write in about. Each one opens WhatsApp
   * with a message already started, so the sender only fills in the blanks.
   */
  actionsHeading: "What do you need?",
  actionsIntro: "Pick one and WhatsApp opens with the message started for you.",
  quickActions: [
    {
      title: "Add my university",
      body: "Your university or campus is missing from the list.",
      message:
        "Hi SetGPA, please add my university.\nUniversity: \nCity: \nProgramme or department: \nHandbook link or photo: (attached)",
    },
    {
      title: "Report a wrong grade table",
      body: "A grade point or marks range does not match your handbook.",
      message:
        "Hi SetGPA, a grade table on your site does not match my handbook.\nUniversity: \nGrade that is wrong: \nCorrect value: \nHandbook page or photo: (attached)",
    },
    {
      title: "Suggest an improvement",
      body: "A calculator result looks wrong, or you have an idea to make the site better.",
      message: "Hi SetGPA, I have a suggestion:\n",
    },
  ],
  checklistHeading: "Make your message easy to act on",
  checklist: [
    "The university, and the programme or department.",
    "What the correct values are.",
    "A photo or link of the handbook page. With one, the table can be marked as verified straight away.",
  ],
  responseHeading: "How fast do we reply?",
  helpfulHeading: "What makes a report easy to act on",
  helpfulBody:
    "Tell us the university, the programme or department, and what the correct values are. If you can attach a photo or a link to the handbook page, the correction can be applied and marked as verified straight away.",
  responseNote:
    "This is a one-person project, so replies are not instant. Every message is read.",
} as const;

export const footerContent = {
  description:
    "GPA and CGPA calculators built around each university's own grade table.",
  disclaimer:
    "This is an independent student project. It is not affiliated with any university. Grading data is entered manually and may contain mistakes - always confirm with your own department.",
  quickLinksHeading: "Quick links",
  contactHeading: "Contact",
  whatsappLabel: "Message on WhatsApp",
  rightsLabel: "All rights reserved.",
  homeLabel: "Home",
} as const;

export const errorContent = {
  notFoundTitle: "Page not found",
  notFoundBody:
    "This page does not exist. The university may have been moved, renamed, or may not be added yet.",
  notFoundCtaLabel: "Back to home",
  genericErrorTitle: "Something went wrong",
  genericErrorBody:
    "We could not load this page right now. Please try again in a moment.",
  retryLabel: "Try again",
} as const;

/** Replaces {placeholders} in the strings above. */
export function fillTemplate(
  template: string,
  values: Record<string, string>,
): string {
  return template.replace(/\{(\w+)\}/g, (match, key: string) =>
    key in values ? values[key] : match,
  );
}
