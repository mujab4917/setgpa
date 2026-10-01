/**
 * LAHORE UNIVERSITIES
 *
 * Grade tables follow the patterns documented in types.ts. Where research into
 * a university's published rules showed a specific table, that university uses
 * its own scale - for example UET Lahore, whose lowest passing grade is D 1.50
 * with no D+ and no A+, and the University of the Punjab, which uses 0.70/0.30
 * steps rather than thirds.
 */

import type { SeedUniversity } from "./types";

export const lahoreUniversities: SeedUniversity[] = [
  {
    citySlug: "lahore",
    name: "University of the Punjab",
    shortName: "Punjab University",
    slug: "punjab-university",
    campus: "Quaid-e-Azam Campus",
    website: "https://pu.edu.pk",
    scale: "tenths",
    established: 1882,
    sector: "Public",
    type: "General",
    notableFor: "The oldest university in Pakistan, with faculties across almost every discipline.",
    summary:
      "The oldest public university in Pakistan, with faculties spanning sciences, arts, law, commerce and pharmacy.",
    detail:
      "Founded in 1882, the University of the Punjab is the oldest university in Pakistan and one of the largest, teaching tens of thousands of students across its Quaid-e-Azam and Allama Iqbal campuses. Its semester programmes use a four point scale with plus and minus grades in 0.70 and 0.30 steps, so an A- is worth 3.70 rather than the 3.67 used at many private universities. Departments publish their own detailed rules, so confirm the table used by your own department.",
  },
  {
    citySlug: "lahore",
    name: "University of Engineering and Technology Lahore",
    shortName: "UET Lahore",
    slug: "uet-lahore",
    campus: "Main Campus, G.T. Road",
    website: "https://www.uet.edu.pk",
    scale: "uet",
    established: 1921,
    sector: "Public",
    type: "Engineering",
    notableFor: "Pakistan's oldest engineering institution, with campuses across Punjab.",
    summary:
      "Public sector engineering university and one of the oldest engineering institutions in Pakistan.",
    detail:
      "The University of Engineering and Technology Lahore traces its roots to 1921 and is Pakistan's oldest engineering institution, with programmes across civil, electrical, mechanical, computer, chemical and mining engineering. Its undergraduate grade table is unusual: the lowest passing grade is D at 1.50 grade points, and there is no D+ or A+. Theory subjects are normally graded relatively, so your letter grade depends on the class distribution as well as your own marks.",
  },
  {
    citySlug: "lahore",
    name: "Lahore University of Management Sciences",
    shortName: "LUMS",
    slug: "lums",
    campus: "DHA Lahore Campus",
    website: "https://lums.edu.pk",
    // LUMS uses a 12-grade table: the shared "tenths" pattern (which the
    // University of the Punjab follows) has no D+, but LUMS does. Given its
    // own table so the two cannot drift into each other.
    scale: "tenths",
    customGrades: [
      { grade: "A+", gradePoint: 4.0 },
      { grade: "A", gradePoint: 4.0 },
      { grade: "A-", gradePoint: 3.7 },
      { grade: "B+", gradePoint: 3.3 },
      { grade: "B", gradePoint: 3.0 },
      { grade: "B-", gradePoint: 2.7 },
      { grade: "C+", gradePoint: 2.3 },
      { grade: "C", gradePoint: 2.0 },
      { grade: "C-", gradePoint: 1.7 },
      { grade: "D+", gradePoint: 1.3 },
      { grade: "D", gradePoint: 1.0 },
      { grade: "F", gradePoint: 0.0 },
    ],
    established: 1984,
    sector: "Private",
    type: "Business",
    notableFor: "Pakistan's best known private university, particularly for business and law.",
    summary:
      "Private university known for its business, humanities, law, science and engineering schools.",
    detail:
      "The Lahore University of Management Sciences opened in 1984 as a business school and has since grown into a full university with schools of management, humanities and social sciences, science and engineering, law, and education. Its grade table uses plus and minus grades in 0.70 and 0.30 steps on a four point scale, and many courses are graded relative to the class.",
  },
  {
    citySlug: "lahore",
    name: "FAST-NUCES Lahore",
    shortName: "FAST Lahore",
    slug: "fast-nuces",
    campus: "Lahore Campus, Faisal Town",
    website: "https://lhr.nu.edu.pk",
    scale: "thirds",
    established: 2000,
    sector: "Private",
    type: "IT",
    notableFor: "One of Pakistan's leading computer science campuses.",
    summary:
      "Computing and engineering focused campus of the National University of Computer and Emerging Sciences.",
    detail:
      "FAST-NUCES Lahore is the Lahore campus of the National University of Computer and Emerging Sciences, best known for its computer science and software engineering programmes. Grading follows the university's central rules on a four point scale with plus and minus grades in thirds, so an A- is worth 3.67 and a B+ 3.33. Instructors declare at the start of a course whether it will be graded absolutely or relative to the class; both map to the same grade points.",
  },
  {
    citySlug: "lahore",
    name: "COMSATS University Islamabad - Lahore Campus",
    shortName: "COMSATS Lahore",
    slug: "comsats-lahore",
    campus: "Lahore Campus, Defence Road",
    website: "https://lahore.comsats.edu.pk",
    scale: "thirds",
    established: 2002,
    sector: "Public",
    type: "IT",
    notableFor: "A large computing and engineering campus of the COMSATS network.",
    summary:
      "Lahore campus of COMSATS University Islamabad, with computing, engineering and business programmes.",
    detail:
      "COMSATS University Islamabad, Lahore Campus offers computing, engineering, management, mathematics and science programmes. Grading follows the university's central semester rules on a four point scale with plus and minus grades in thirds. Because the grade table is set centrally, other COMSATS campuses use the same values.",
  },
  {
    citySlug: "lahore",
    name: "Government College University Lahore",
    shortName: "GCU Lahore",
    slug: "gcu-lahore",
    campus: "Katchery Road Campus",
    website: "https://gcu.edu.pk",
    scale: "simple",
    established: 1864,
    sector: "Public",
    type: "General",
    notableFor: "A historic institution whose alumni include Nobel laureate Abdus Salam.",
    summary:
      "Historic public university with strong sciences, humanities and languages faculties.",
    detail:
      "Government College University Lahore began as Government College in 1864 and was granted university status in 2002. It is one of Pakistan's most storied institutions, counting Nobel laureate Abdus Salam and poet Allama Iqbal among those connected to it. Semester programmes run on a four point scale.",
  },
  {
    citySlug: "lahore",
    name: "King Edward Medical University",
    shortName: "KEMU",
    slug: "king-edward-medical-university",
    campus: "Nila Gumbad, Lahore",
    website: "https://www.kemu.edu.pk",
    scale: "simple",
    established: 1860,
    sector: "Public",
    type: "Medical",
    notableFor: "The oldest medical institution in Pakistan.",
    summary:
      "The country's oldest medical school, offering MBBS, dentistry and postgraduate medicine.",
    detail:
      "King Edward Medical University traces its history to 1860, making it the oldest medical institution in Pakistan, and was granted university status in 2005. It offers MBBS, dentistry, nursing and a wide range of postgraduate medical programmes. Professional medical programmes are often assessed by annual professional examinations rather than semester GPA, so check which system applies to your year before relying on a GPA figure.",
  },
  {
    citySlug: "lahore",
    name: "University of Veterinary and Animal Sciences",
    shortName: "UVAS",
    slug: "uvas-lahore",
    campus: "Out Fall Road Campus",
    website: "https://www.uvas.edu.pk",
    scale: "simple",
    established: 2002,
    sector: "Public",
    type: "Veterinary",
    notableFor: "Pakistan's leading veterinary and animal sciences university.",
    summary:
      "Specialist public university for veterinary medicine, animal production and food sciences.",
    detail:
      "The University of Veterinary and Animal Sciences was established in 2002 from a veterinary college whose origins go back to 1882. It covers veterinary medicine, animal production, biosciences, fisheries and food technology, and runs sub-campuses elsewhere in Punjab. Semester programmes use a four point scale.",
  },
  {
    citySlug: "lahore",
    name: "Lahore College for Women University",
    shortName: "LCWU",
    slug: "lcwu",
    campus: "Jail Road Campus",
    website: "https://www.lcwu.edu.pk",
    scale: "simple",
    established: 1922,
    sector: "Public",
    type: "General",
    notableFor: "One of Pakistan's oldest and largest women's universities.",
    summary:
      "Public women's university with sciences, arts, design and management programmes.",
    detail:
      "Lahore College for Women began in 1922 and became a university in 2002. It is one of the largest women's universities in Pakistan, with faculties across natural sciences, social sciences, design, computing and management. Semester programmes use a four point scale.",
  },
  {
    citySlug: "lahore",
    name: "Information Technology University",
    shortName: "ITU Lahore",
    slug: "itu-lahore",
    campus: "Arfa Software Technology Park",
    website: "https://itu.edu.pk",
    scale: "thirds",
    established: 2012,
    sector: "Public",
    type: "IT",
    notableFor: "A public technology university based in Lahore's software technology park.",
    summary:
      "Public technology university focused on computing, electrical engineering and data science.",
    detail:
      "The Information Technology University of the Punjab was established in 2012 and is based in the Arfa Software Technology Park. It concentrates on computer science, electrical engineering, data science and technology policy, with a strong research focus for its size. Grading uses a four point scale with plus and minus grades.",
  },
  {
    citySlug: "lahore",
    name: "University of Management and Technology",
    shortName: "UMT Lahore",
    slug: "umt-lahore",
    campus: "C-II Johar Town Campus",
    website: "https://www.umt.edu.pk",
    scale: "thirds",
    established: 1990,
    sector: "Private",
    type: "General",
    notableFor: "A large private university with business, engineering and social sciences schools.",
    summary:
      "Private university with business, engineering, computing, law and social sciences schools.",
    detail:
      "The University of Management and Technology grew out of an institute founded in 1990 and received its university charter in 2004. It is one of Lahore's largest private universities, with schools covering business, engineering, computing, law, social sciences and education. Grading uses a four point scale with plus and minus grades in thirds.",
  },
  {
    citySlug: "lahore",
    name: "University of Central Punjab",
    shortName: "UCP",
    slug: "ucp-lahore",
    campus: "Johar Town Campus",
    website: "https://ucp.edu.pk",
    scale: "thirds",
    established: 1999,
    sector: "Private",
    type: "Business",
    notableFor: "A large private university known for its business and accounting programmes.",
    summary:
      "Private university with business, engineering, computing, pharmacy and media programmes.",
    detail:
      "The University of Central Punjab began as the Punjab College of Business Administration in 1999 and was chartered as a university in 2002. It is best known for business, accounting and finance, alongside engineering, computing, pharmacy and media studies. Grading uses a four point scale with plus and minus grades.",
  },
  {
    citySlug: "lahore",
    name: "The University of Lahore",
    shortName: "UOL",
    slug: "university-of-lahore",
    campus: "Defence Road Main Campus",
    website: "https://uol.edu.pk",
    scale: "thirds",
    established: 1999,
    sector: "Private",
    type: "General",
    notableFor: "One of the largest private universities in Pakistan by enrolment.",
    summary:
      "Large private university covering health sciences, engineering, business and allied health.",
    detail:
      "The University of Lahore was established in 1999 and is among the largest private universities in Pakistan, with a medical and dental college, allied health sciences, engineering, pharmacy, business and social sciences. Semester programmes use a four point scale with plus and minus grades.",
  },
  {
    citySlug: "lahore",
    name: "Kinnaird College for Women University",
    shortName: "Kinnaird College",
    slug: "kinnaird-college",
    campus: "Jail Road, Lahore",
    website: "https://www.kinnaird.edu.pk",
    scale: "thirds",
    established: 1913,
    sector: "Public",
    type: "General",
    notableFor: "A historic women's college, now a degree-awarding university.",
    summary:
      "Long-established women's institution with sciences, humanities and business programmes.",
    detail:
      "Kinnaird College for Women was founded in 1913 and is one of the most recognised women's institutions in Pakistan, granted degree-awarding status in 2002. It teaches natural sciences, social sciences, humanities, media and business on a semester system with a four point scale.",
  },
  {
    citySlug: "lahore",
    name: "Beaconhouse National University",
    shortName: "BNU",
    slug: "bnu-lahore",
    campus: "Tarogil Campus, Raiwind Road",
    website: "https://www.bnu.edu.pk",
    scale: "thirds",
    established: 2003,
    sector: "Private",
    type: "Liberal Arts",
    notableFor: "Pakistan's first liberal arts university, strong in design and visual arts.",
    summary:
      "Private liberal arts university known for design, architecture, media and visual arts.",
    detail:
      "Beaconhouse National University was established in 2003 as Pakistan's first liberal arts university. Its School of Visual Arts and Design, architecture programmes and media school are its best known faculties, alongside computer science, business and education. Grading uses a four point scale with plus and minus grades.",
  },
  {
    citySlug: "lahore",
    name: "National College of Arts",
    shortName: "NCA",
    slug: "nca-lahore",
    campus: "The Mall, Lahore",
    website: "https://www.nca.edu.pk",
    scale: "thirds",
    established: 1875,
    sector: "Public",
    type: "Arts",
    notableFor: "Pakistan's foremost art and design institution, founded as the Mayo School of Arts.",
    summary:
      "Historic public institution for fine arts, design, architecture and film.",
    detail:
      "The National College of Arts began in 1875 as the Mayo School of Arts and is Pakistan's foremost institution for fine art, design, architecture, musicology and film and television. Degree programmes run on a semester system with a four point scale; studio work is assessed by portfolio and jury alongside written components.",
  },
];
