/**
 * ISLAMABAD, KHYBER PAKHTUNKHWA, BALOCHISTAN AND AZAD JAMMU & KASHMIR
 *
 * Islamabad, Peshawar, Abbottabad, Mardan, Swat, Quetta and Muzaffarabad.
 */

import type { SeedUniversity } from "./types";

export const northUniversities: SeedUniversity[] = [
  // ------------------------------ ISLAMABAD ------------------------------
  {
    citySlug: "islamabad",
    name: "National University of Sciences and Technology",
    shortName: "NUST",
    slug: "nust",
    campus: "H-12 Main Campus",
    website: "https://nust.edu.pk",
    scale: "halves",
    established: 1991,
    sector: "Public",
    type: "Engineering",
    notableFor: "Consistently among Pakistan's highest-ranked universities.",
    summary:
      "Federally chartered university with large engineering, computing, business and sciences schools.",
    detail:
      "The National University of Sciences and Technology was established in 1991 and is consistently ranked among Pakistan's leading universities. Its H-12 campus in Islamabad hosts constituent schools in electrical and mechanical engineering, computing, civil engineering, natural sciences, business and social sciences. NUST's undergraduate grade table uses 0.50 steps with no minus grades, so B+ is worth 3.50 and there is no A- or B-. Most courses are graded relative to the class.",
  },
  {
    citySlug: "islamabad",
    name: "Quaid-i-Azam University",
    shortName: "QAU",
    slug: "quaid-i-azam-university",
    campus: "Main Campus, Islamabad",
    website: "https://qau.edu.pk",
    scale: "thirds",
    established: 1967,
    sector: "Public",
    type: "General",
    notableFor: "Pakistan's leading research university in the natural and social sciences.",
    summary:
      "Research-focused public university with strong natural and social sciences faculties.",
    detail:
      "Quaid-i-Azam University was established in 1967 and is among Pakistan's foremost research universities, particularly in physics, chemistry, biological sciences, economics and anthropology. Its campus sits at the foot of the Margalla Hills. Programmes use a four point semester grading system.",
  },
  {
    citySlug: "islamabad",
    name: "Pakistan Institute of Engineering and Applied Sciences",
    shortName: "PIEAS",
    slug: "pieas",
    campus: "Nilore, Islamabad",
    website: "https://www.pieas.edu.pk",
    scale: "thirds",
    established: 1967,
    sector: "Public",
    type: "Engineering",
    notableFor: "A highly selective engineering and nuclear sciences institute.",
    summary:
      "Public institute specialising in engineering, physics and nuclear sciences.",
    detail:
      "The Pakistan Institute of Engineering and Applied Sciences traces its origins to 1967 and is one of the most selective institutions in Pakistan, concentrating on mechanical, electrical, chemical and nuclear engineering along with physics, mathematics and medical physics. It is closely linked to Pakistan's atomic energy research programme.",
  },
  {
    citySlug: "islamabad",
    name: "COMSATS University Islamabad",
    shortName: "COMSATS Islamabad",
    slug: "comsats-islamabad",
    campus: "Park Road, Islamabad",
    website: "https://www.comsats.edu.pk",
    scale: "thirds",
    established: 1998,
    sector: "Public",
    type: "IT",
    notableFor: "The principal campus of Pakistan's largest multi-campus technology university.",
    summary:
      "Principal campus of COMSATS University, covering computing, engineering, business and sciences.",
    detail:
      "COMSATS University Islamabad was established in 1998 and has grown into one of Pakistan's largest universities, with campuses in Lahore, Abbottabad, Wah, Attock, Sahiwal and Vehari. The Islamabad campus offers computing, electrical and civil engineering, architecture, management, pharmacy, biosciences and mathematics. The grade table is set centrally, so all campuses share it.",
  },
  {
    citySlug: "islamabad",
    name: "International Islamic University Islamabad",
    shortName: "IIUI",
    slug: "iiui",
    campus: "H-10 Campus",
    website: "https://www.iiu.edu.pk",
    // VERIFIED against an official IIUI semester result card (Fall 2025).
    // The card's "Key to Letter Grades" lists eight grades with no minus
    // grades at all, and its stated GPA of 2.75 for 3xB+, 2xC+ and 1xD over
    // 18 credit hours only reconciles with these 0.50-step values:
    //   3(3.5) + 2(2.5) + 1(1.0) = 16.5  ->  49.5 / 18 = 2.75
    scale: "halves",
    // Marks ranges are taken from the card's printed Key to Letter Grades.
    customGrades: [
      { grade: "A", gradePoint: 4.0, minPercentage: 80, maxPercentage: 100 },
      { grade: "B+", gradePoint: 3.5, minPercentage: 75, maxPercentage: 80 },
      { grade: "B", gradePoint: 3.0, minPercentage: 70, maxPercentage: 75 },
      { grade: "C+", gradePoint: 2.5, minPercentage: 65, maxPercentage: 70 },
      { grade: "C", gradePoint: 2.0, minPercentage: 60, maxPercentage: 65 },
      { grade: "D+", gradePoint: 1.5, minPercentage: 55, maxPercentage: 60 },
      { grade: "D", gradePoint: 1.0, minPercentage: 50, maxPercentage: 55 },
      { grade: "F", gradePoint: 0.0, minPercentage: 0, maxPercentage: 50 },
    ],
    verified: true,
    sourceNote:
      "An official IIUI semester result card (Fall 2025), including its printed Key to Letter Grades. The card's stated GPA reproduces exactly on these values.",
    established: 1980,
    sector: "Public",
    type: "General",
    notableFor: "An international university with students from across the Muslim world.",
    summary:
      "Public university with separate male and female campuses across Islamic studies, law, sciences and engineering.",
    detail:
      "The International Islamic University Islamabad was established in 1980 and teaches a large international student body alongside Pakistani students. It offers Islamic studies, Shariah and law, languages, management, engineering, computing and basic sciences, with separate campuses for male and female students.",
  },
  {
    citySlug: "islamabad",
    name: "Air University",
    shortName: "Air University",
    slug: "air-university",
    campus: "E-9 Main Campus",
    website: "https://www.au.edu.pk",
    scale: "thirds",
    established: 2002,
    sector: "Public",
    type: "Engineering",
    notableFor: "Known for aerospace, avionics and mechatronics engineering.",
    summary:
      "University with engineering, computing, business and aerospace related programmes.",
    detail:
      "Air University was chartered in 2002 and is based in Islamabad with campuses in Multan and Kamra. It is best known for aerospace, avionics, mechatronics and electrical engineering, alongside computing, mathematics, business and social sciences.",
  },
  {
    citySlug: "islamabad",
    name: "National University of Modern Languages",
    shortName: "NUML",
    slug: "numl-islamabad",
    campus: "Sector H-9, Islamabad",
    website: "https://numl.edu.pk",
    scale: "thirds",
    established: 1970,
    sector: "Public",
    type: "Languages",
    notableFor: "Pakistan's principal institution for language teaching, covering dozens of languages.",
    summary:
      "Public university specialising in languages, alongside management and social sciences.",
    detail:
      "The National University of Modern Languages began in 1970 as a language institute and became a university in 2000. It teaches more than twenty languages, from Arabic, Persian and Chinese to German, French and Russian, alongside management sciences, computing, education and international relations.",
  },
  {
    citySlug: "islamabad",
    name: "Institute of Space Technology",
    shortName: "IST",
    slug: "ist-islamabad",
    campus: "Islamabad Highway Campus",
    website: "https://www.ist.edu.pk",
    scale: "thirds",
    established: 2002,
    sector: "Public",
    type: "Engineering",
    notableFor: "Pakistan's dedicated university for space science and aerospace engineering.",
    summary:
      "Public university specialising in aerospace, avionics and space science.",
    detail:
      "The Institute of Space Technology was established in 2002 under Pakistan's national space agency and specialises in aerospace engineering, avionics, electrical engineering, materials science, remote sensing and space science.",
  },
  {
    citySlug: "islamabad",
    name: "Capital University of Science and Technology",
    shortName: "CUST",
    slug: "cust-islamabad",
    campus: "Expressway, Kahuta Road",
    website: "https://www.cust.edu.pk",
    scale: "thirds",
    established: 1998,
    sector: "Private",
    type: "Engineering",
    notableFor: "Private university with engineering, computing and management programmes.",
    summary:
      "Private university covering engineering, computing, mathematics and management.",
    detail:
      "The Capital University of Science and Technology was founded in 1998 and chartered in 2016. It offers electrical, mechanical and civil engineering, computer science, mathematics, psychology and management sciences on a semester system with a four point scale.",
  },
  {
    citySlug: "islamabad",
    name: "Bahria University Islamabad",
    shortName: "Bahria Islamabad",
    slug: "bahria-islamabad",
    campus: "E-8 Campus, Islamabad",
    website: "https://www.bahria.edu.pk",
    scale: "thirds",
    established: 2000,
    sector: "Private",
    type: "General",
    notableFor: "Multi-campus university with engineering, business and health sciences.",
    summary:
      "Private university with engineering, computing, business, law and psychology programmes.",
    detail:
      "Bahria University's Islamabad campus offers engineering, computer science, business administration, law, psychology, media studies and earth sciences under the university's central semester rules.",
  },
  {
    citySlug: "islamabad",
    name: "Allama Iqbal Open University",
    shortName: "AIOU",
    slug: "aiou",
    campus: "Sector H-8, Islamabad",
    website: "https://www.aiou.edu.pk",
    scale: "simple",
    established: 1974,
    sector: "Public",
    type: "Distance Education",
    notableFor: "One of the largest distance-learning universities in the world by enrolment.",
    summary:
      "Public distance-learning university serving students across Pakistan.",
    detail:
      "Allama Iqbal Open University was established in 1974 as Asia's first open university and is among the largest universities in the world by enrolment. It delivers education by distance learning across Pakistan, from basic literacy and matriculation through to doctoral programmes. Assessment mixes assignments, workshops and final examinations, and rules differ by programme level.",
  },
  {
    citySlug: "islamabad",
    name: "Shifa Tameer-e-Millat University",
    shortName: "STMU",
    slug: "stmu-islamabad",
    campus: "H-8/4, Islamabad",
    website: "https://stmu.edu.pk",
    scale: "thirds",
    established: 2014,
    sector: "Private",
    type: "Medical",
    notableFor: "Private health sciences university attached to Shifa International Hospital.",
    summary:
      "Private university focused on medicine, nursing and allied health sciences.",
    detail:
      "Shifa Tameer-e-Millat University was chartered in 2014 and is built around Shifa International Hospital in Islamabad, covering medicine, dentistry, nursing, pharmacy and allied health sciences.",
  },

  // ------------------------------- PESHAWAR ------------------------------
  {
    citySlug: "peshawar",
    name: "University of Peshawar",
    shortName: "UoP",
    slug: "university-of-peshawar",
    campus: "Main Campus, University Town",
    website: "https://www.uop.edu.pk",
    scale: "simple",
    established: 1950,
    sector: "Public",
    type: "General",
    notableFor: "The oldest and largest university in Khyber Pakhtunkhwa.",
    summary:
      "The oldest and largest public university in Khyber Pakhtunkhwa.",
    detail:
      "The University of Peshawar was established in 1950 and is the oldest university in Khyber Pakhtunkhwa. It covers arts, sciences, social sciences, law, management, pharmacy and Islamic studies, and is known for its archaeology and Pashto studies departments. Semester programmes use a four point scale.",
  },
  {
    citySlug: "peshawar",
    name: "University of Engineering and Technology Peshawar",
    shortName: "UET Peshawar",
    slug: "uet-peshawar",
    campus: "Main Campus, Jamrud Road",
    website: "https://www.uetpeshawar.edu.pk",
    scale: "halves",
    established: 1980,
    sector: "Public",
    type: "Engineering",
    notableFor: "The province's principal engineering university, with campuses across KP.",
    summary:
      "Public engineering university with campuses across Khyber Pakhtunkhwa.",
    detail:
      "The University of Engineering and Technology Peshawar became a university in 1980, developing from an engineering college founded in 1952. It is the province's principal engineering institution, with campuses in Abbottabad, Bannu, Mardan, Kohat and Jalozai covering civil, electrical, mechanical, mining, agricultural and computer engineering.",
  },
  {
    citySlug: "peshawar",
    name: "Khyber Medical University",
    shortName: "KMU",
    slug: "khyber-medical-university",
    campus: "Phase V, Hayatabad",
    website: "https://www.kmu.edu.pk",
    scale: "simple",
    established: 2007,
    sector: "Public",
    type: "Medical",
    notableFor: "Oversees medical and allied health institutions across Khyber Pakhtunkhwa.",
    summary:
      "Public medical university overseeing medical and allied health institutions in the province.",
    detail:
      "Khyber Medical University was established in 2007 and oversees medical, dental, nursing and allied health institutions across Khyber Pakhtunkhwa, including the historic Khyber Medical College. Assessment varies between professional and semester-based programmes.",
  },
  {
    citySlug: "peshawar",
    name: "Institute of Management Sciences Peshawar",
    shortName: "IMSciences",
    slug: "imsciences-peshawar",
    campus: "Hayatabad Campus",
    website: "https://imsciences.edu.pk",
    scale: "thirds",
    established: 1995,
    sector: "Public",
    type: "Business",
    notableFor: "The province's leading public business school.",
    summary:
      "Public business school with management, computing and economics programmes.",
    detail:
      "The Institute of Management Sciences Peshawar was established in 1995 and is the province's leading public business school, teaching management sciences, computer science, economics and development studies on a semester system with plus and minus grades.",
  },
  {
    citySlug: "peshawar",
    name: "The University of Agriculture Peshawar",
    shortName: "AUP",
    slug: "agriculture-university-peshawar",
    campus: "University Campus, Peshawar",
    website: "https://www.aup.edu.pk",
    scale: "simple",
    established: 1981,
    sector: "Public",
    type: "Agriculture",
    notableFor: "The province's agricultural university, serving a largely farming economy.",
    summary:
      "Public agricultural university with crop, animal and food science faculties.",
    detail:
      "The University of Agriculture Peshawar was established in 1981 and serves Khyber Pakhtunkhwa's farming economy, with faculties in crop production and protection, animal husbandry, nutrition sciences, agricultural engineering and rural development.",
  },
  {
    citySlug: "peshawar",
    name: "Islamia College University Peshawar",
    shortName: "Islamia College",
    slug: "islamia-college-peshawar",
    campus: "Jamrud Road, Peshawar",
    website: "https://www.icp.edu.pk",
    scale: "simple",
    established: 1913,
    sector: "Public",
    type: "General",
    notableFor: "A historic college, founded in 1913, whose building is a provincial landmark.",
    summary:
      "Historic public university with sciences, arts and social sciences programmes.",
    detail:
      "Islamia College Peshawar was founded in 1913 and granted university status in 2008. Its distinctive campus is one of the province's landmarks, and it teaches sciences, arts, social sciences, management and Islamic studies on a semester system.",
  },
  {
    citySlug: "peshawar",
    name: "Shaheed Benazir Bhutto Women University Peshawar",
    shortName: "SBBWU",
    slug: "sbbwu-peshawar",
    campus: "Charsadda Road, Peshawar",
    website: null,
    scale: "simple",
    established: 2004,
    sector: "Public",
    type: "General",
    notableFor: "The province's first public women's university.",
    summary:
      "Public women's university with sciences, arts and management programmes.",
    detail:
      "Shaheed Benazir Bhutto Women University Peshawar was established in 2004 as the first public women's university in Khyber Pakhtunkhwa, teaching sciences, social sciences, computing, education and management.",
  },
  {
    citySlug: "peshawar",
    name: "CECOS University of Information Technology and Emerging Sciences",
    shortName: "CECOS University",
    slug: "cecos-university",
    campus: "Phase VI, Hayatabad",
    website: "https://www.cecos.edu.pk",
    scale: "thirds",
    established: 1986,
    sector: "Private",
    type: "IT",
    notableFor: "One of the province's earliest private computing institutions.",
    summary:
      "Private university with computing, engineering and management programmes.",
    detail:
      "CECOS University of Information Technology and Emerging Sciences was established in 1986 and chartered in 1992, making it one of Khyber Pakhtunkhwa's earliest private institutions. It offers computing, electrical and civil engineering, architecture and management.",
  },

  // ------------------------------ ABBOTTABAD -----------------------------
  {
    citySlug: "abbottabad",
    name: "COMSATS University Islamabad - Abbottabad Campus",
    shortName: "COMSATS Abbottabad",
    slug: "comsats-abbottabad",
    campus: "University Road, Abbottabad",
    website: null,
    scale: "thirds",
    established: 2001,
    sector: "Public",
    type: "IT",
    notableFor: "A large COMSATS campus set in the Hazara hills.",
    summary:
      "COMSATS campus with computing, engineering, biosciences and management programmes.",
    detail:
      "COMSATS University Islamabad's Abbottabad campus opened in 2001 and is one of the network's largest, offering computer science, electrical engineering, environmental sciences, biotechnology, pharmacy, management and earth sciences under the university's central grading rules.",
  },
  {
    citySlug: "abbottabad",
    name: "Ayub Medical College",
    shortName: "Ayub Medical College",
    slug: "ayub-medical-college",
    campus: "Mansehra Road, Abbottabad",
    website: null,
    scale: "simple",
    established: 1979,
    sector: "Public",
    type: "Medical",
    notableFor: "The main medical institution of the Hazara region.",
    summary:
      "Public medical college offering MBBS with a large teaching hospital complex.",
    detail:
      "Ayub Medical College was established in 1979 and is the main medical institution of the Hazara region, offering MBBS and postgraduate training through the Ayub Teaching Hospital complex.",
  },
  {
    citySlug: "abbottabad",
    name: "Abbottabad University of Science and Technology",
    shortName: "AUST",
    slug: "aust-abbottabad",
    campus: "Havelian, Abbottabad",
    website: null,
    scale: "simple",
    established: 2017,
    sector: "Public",
    type: "General",
    notableFor: "A newer public university serving the Hazara division.",
    summary:
      "Public university with sciences, computing and management programmes.",
    detail:
      "Abbottabad University of Science and Technology was established in 2017 to expand public higher education in the Hazara division, teaching natural sciences, computing, management and social sciences on a semester system.",
  },
  {
    citySlug: "abbottabad",
    name: "UET Peshawar Abbottabad Campus",
    shortName: "UET Abbottabad",
    slug: "uet-abbottabad",
    campus: "Abbottabad Campus",
    website: null,
    scale: "halves",
    established: 2002,
    sector: "Public",
    type: "Engineering",
    notableFor: "Engineering campus of UET Peshawar in the Hazara region.",
    summary:
      "UET campus with civil, electrical and computer engineering programmes.",
    detail:
      "The University of Engineering and Technology Peshawar's Abbottabad campus offers civil, electrical, computer and mechanical engineering under the parent university's semester rules and grade table.",
  },

  // -------------------------------- MARDAN -------------------------------
  {
    citySlug: "mardan",
    name: "Abdul Wali Khan University Mardan",
    shortName: "AWKUM",
    slug: "awkum-mardan",
    campus: "Garden Campus, Mardan",
    website: "https://www.awkum.edu.pk",
    scale: "simple",
    established: 2009,
    sector: "Public",
    type: "General",
    notableFor: "One of Khyber Pakhtunkhwa's largest universities by enrolment.",
    summary:
      "Large public university with sciences, arts, computing and social sciences.",
    detail:
      "Abdul Wali Khan University Mardan was established in 2009 and has grown quickly into one of Khyber Pakhtunkhwa's largest universities, with faculties in natural sciences, chemical and life sciences, arts and humanities, social sciences, computing and business, plus several sub-campuses.",
  },
  {
    citySlug: "mardan",
    name: "Bacha Khan Medical College Mardan",
    shortName: "BKMC",
    slug: "bkmc-mardan",
    campus: "Mardan",
    website: null,
    scale: "simple",
    established: 2010,
    sector: "Public",
    type: "Medical",
    notableFor: "The district's public medical college.",
    summary: "Public medical college offering MBBS with an attached teaching hospital.",
    detail:
      "Bacha Khan Medical College Mardan was established in 2010 and offers MBBS with an attached teaching hospital serving the Mardan division. Medical programmes are normally assessed by professional examinations.",
  },
  {
    citySlug: "mardan",
    name: "Women University Mardan",
    shortName: "WUM Mardan",
    slug: "women-university-mardan",
    campus: "Mardan",
    website: null,
    scale: "simple",
    established: 2018,
    sector: "Public",
    type: "General",
    notableFor: "Public women's university for the Mardan division.",
    summary: "Public women's university with sciences, arts and computing programmes.",
    detail:
      "Women University Mardan was established in 2018 to expand access to higher education for women in northern Khyber Pakhtunkhwa, with programmes in sciences, social sciences, computing and education.",
  },

  // --------------------------------- SWAT --------------------------------
  {
    citySlug: "swat",
    name: "University of Swat",
    shortName: "University of Swat",
    slug: "university-of-swat",
    campus: "Main Campus, Charbagh",
    website: "https://www.uswat.edu.pk",
    scale: "simple",
    established: 2010,
    sector: "Public",
    type: "General",
    notableFor: "The main public university of the Malakand division.",
    summary:
      "Public university with sciences, arts, computing and management programmes.",
    detail:
      "The University of Swat was established in 2010 and serves the Malakand division, teaching natural sciences, social sciences, computing, management, education and languages on a semester system with a four point scale.",
  },
  {
    citySlug: "swat",
    name: "Saidu Medical College",
    shortName: "SMC Swat",
    slug: "saidu-medical-college",
    campus: "Saidu Sharif, Swat",
    website: null,
    scale: "simple",
    established: 1998,
    sector: "Public",
    type: "Medical",
    notableFor: "The Malakand division's public medical college.",
    summary: "Public medical college offering MBBS with an attached teaching hospital.",
    detail:
      "Saidu Medical College was established in 1998 at Saidu Sharif and offers MBBS with an attached teaching hospital serving the Swat valley and wider Malakand division.",
  },

  // -------------------------------- QUETTA -------------------------------
  {
    citySlug: "quetta",
    name: "University of Balochistan",
    shortName: "UoB",
    slug: "university-of-balochistan",
    campus: "Sariab Road Campus",
    website: "https://www.uob.edu.pk",
    scale: "simple",
    established: 1970,
    sector: "Public",
    type: "General",
    notableFor: "The oldest and largest university in Balochistan.",
    summary:
      "The province's oldest and largest public university, covering most disciplines.",
    detail:
      "The University of Balochistan was established in 1970 and is the oldest and largest university in the province, with faculties in arts, sciences, management, law, education, pharmacy and social sciences. Semester programmes use a four point scale.",
  },
  {
    citySlug: "quetta",
    name: "Balochistan University of Information Technology, Engineering and Management Sciences",
    shortName: "BUITEMS",
    slug: "buitems",
    campus: "Takatu Campus, Airport Road",
    website: "https://www.buitms.edu.pk",
    scale: "thirds",
    established: 2002,
    sector: "Public",
    type: "IT",
    notableFor: "Balochistan's main technology and engineering university.",
    summary:
      "Public university focused on information technology, engineering and management.",
    detail:
      "BUITEMS was established in 2002 and has become Balochistan's principal technology university, offering information technology, electrical, civil, mechanical, mining and textile engineering, management sciences, life sciences and architecture.",
  },
  {
    citySlug: "quetta",
    name: "Sardar Bahadur Khan Women's University",
    shortName: "SBKWU",
    slug: "sbk-womens-university",
    campus: "Brewery Road Campus",
    website: null,
    scale: "simple",
    established: 2004,
    sector: "Public",
    type: "General",
    notableFor: "Balochistan's public women's university.",
    summary:
      "Public women's university offering sciences, arts and management programmes.",
    detail:
      "Sardar Bahadur Khan Women's University was established in 2004 as Balochistan's public women's university, with departments across natural sciences, social sciences, management, education and languages.",
  },
  {
    citySlug: "quetta",
    name: "Bolan University of Medical and Health Sciences",
    shortName: "BUMHS",
    slug: "bolan-university",
    campus: "Brewery Road, Quetta",
    website: null,
    scale: "simple",
    established: 2017,
    sector: "Public",
    type: "Medical",
    notableFor: "Balochistan's public medical university, built around Bolan Medical College.",
    summary: "Public medical university serving Balochistan.",
    detail:
      "Bolan University of Medical and Health Sciences was established in 2017 around Bolan Medical College, which dates to 1972. It offers MBBS, dentistry, nursing and allied health programmes for the province.",
  },
  {
    citySlug: "quetta",
    name: "Balochistan University of Engineering and Technology Khuzdar",
    shortName: "BUET Khuzdar",
    slug: "buet-khuzdar",
    campus: "Khuzdar Campus",
    website: null,
    scale: "halves",
    established: 1988,
    sector: "Public",
    type: "Engineering",
    notableFor: "Balochistan's dedicated engineering university.",
    summary:
      "Public engineering university with civil, electrical, mechanical and mining programmes.",
    detail:
      "The Balochistan University of Engineering and Technology at Khuzdar was established in 1988 and is the province's dedicated engineering university, covering civil, electrical, mechanical, computer systems and mining engineering. It is listed here under Quetta as the nearest major city.",
  },

  // ----------------------------- MUZAFFARABAD ----------------------------
  {
    citySlug: "muzaffarabad",
    name: "University of Azad Jammu and Kashmir",
    shortName: "UAJK",
    slug: "uajk-muzaffarabad",
    campus: "King Abdullah Campus, Chattar Klass",
    website: "https://www.ajku.edu.pk",
    scale: "simple",
    established: 1980,
    sector: "Public",
    type: "General",
    notableFor: "The principal university of Azad Jammu and Kashmir.",
    summary:
      "Public university with sciences, arts, engineering and management programmes.",
    detail:
      "The University of Azad Jammu and Kashmir was established in 1980 and is the region's principal university, with campuses in Muzaffarabad, Mirpur, Rawalakot and elsewhere. It teaches sciences, arts, social sciences, engineering, agriculture and management on a semester system.",
  },
  {
    citySlug: "muzaffarabad",
    name: "Azad Jammu and Kashmir Medical College",
    shortName: "AJKMC",
    slug: "ajk-medical-college",
    campus: "Muzaffarabad",
    website: null,
    scale: "simple",
    established: 2010,
    sector: "Public",
    type: "Medical",
    notableFor: "The region's public medical college.",
    summary: "Public medical college offering MBBS with an attached teaching hospital.",
    detail:
      "Azad Jammu and Kashmir Medical College in Muzaffarabad offers MBBS with an attached teaching hospital serving the region. Medical programmes are normally assessed by professional examinations rather than semester GPA.",
  },
];
