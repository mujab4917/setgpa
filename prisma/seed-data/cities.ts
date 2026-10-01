/**
 * CITIES
 *
 * To add a city: add an object here, then add its universities in one of the
 * universities-*.ts files, then run `npm run db:seed`.
 *
 * The order cities appear in on the site is controlled separately, in
 * data/site-content.ts -> cityOrder.priority.
 */

import type { SeedCity } from "./types";

export const cities: SeedCity[] = [
  {
    name: "Lahore",
    slug: "lahore",
    tagline: "Punjab's largest university city",
    description:
      "Lahore is home to a large share of Pakistan's best known universities, from long-established public sector institutions to newer private campuses. Because each of them sets its own grade table, the same letter grade can be worth a different number of grade points depending on where you study. Pick your university below to open a calculator that uses that university's own grading rules.",
  },
  {
    name: "Karachi",
    slug: "karachi",
    tagline: "Pakistan's largest city and business hub",
    description:
      "Karachi hosts many of Pakistan's oldest public universities alongside well-known business, engineering and medical institutions. Grading practice varies widely between them, which is why this site stores a separate grade table for every campus rather than assuming one national standard.",
  },
  {
    name: "Islamabad",
    slug: "islamabad",
    tagline: "The capital's research and engineering campuses",
    description:
      "Islamabad concentrates a number of federally chartered universities, particularly in engineering, computing, sciences and public policy. Choose your university below to calculate your GPA or CGPA using the grade table recorded for that campus.",
  },
  {
    name: "Rawalpindi",
    slug: "rawalpindi",
    tagline: "Twin city campuses next to the capital",
    description:
      "Rawalpindi sits beside Islamabad and has its own established universities in agriculture, medicine, engineering and general sciences, plus campuses of several private universities.",
  },
  {
    name: "Faisalabad",
    slug: "faisalabad",
    tagline: "Agriculture, textiles and engineering",
    description:
      "Faisalabad is a major industrial city whose universities reflect that, with strong agriculture, textile and engineering programmes. Pick your university to open a calculator built around its own grade table.",
  },
  {
    name: "Multan",
    slug: "multan",
    tagline: "Southern Punjab's university centre",
    description:
      "Multan serves as the main higher education centre for southern Punjab, with general, agricultural, technical and medical universities serving a wide region.",
  },
  {
    name: "Peshawar",
    slug: "peshawar",
    tagline: "Khyber Pakhtunkhwa's main campuses",
    description:
      "Peshawar hosts Khyber Pakhtunkhwa's oldest and largest universities across general studies, engineering, management, agriculture and medicine.",
  },
  {
    name: "Quetta",
    slug: "quetta",
    tagline: "Balochistan's higher education centre",
    description:
      "Quetta is the centre of higher education in Balochistan, with the province's main general, technical, agricultural and medical universities.",
  },
  {
    name: "Hyderabad",
    slug: "hyderabad",
    tagline: "Sindh's second city",
    description:
      "Hyderabad is Sindh's second largest city and a long-standing education centre, with public and private universities covering general studies, medicine and engineering.",
  },
  {
    name: "Jamshoro",
    slug: "jamshoro",
    tagline: "Sindh's dedicated education city",
    description:
      "Jamshoro, just across the river from Hyderabad, was developed as an education city and hosts several of Sindh's largest public universities on neighbouring campuses.",
  },
  {
    name: "Gujrat",
    slug: "gujrat",
    tagline: "Home of the University of Gujrat",
    description:
      "Gujrat is a growing education centre in northern Punjab, anchored by the University of Gujrat and its sub-campuses, with additional medical and technical institutions serving the district.",
  },
  {
    name: "Gujranwala",
    slug: "gujranwala",
    tagline: "Industrial city with growing campuses",
    description:
      "Gujranwala is one of Punjab's largest industrial cities, served by university sub-campuses and its own medical and engineering institutions.",
  },
  {
    name: "Sialkot",
    slug: "sialkot",
    tagline: "Export city with newer universities",
    description:
      "Sialkot's export economy has supported a newer generation of universities and campuses focused on business, engineering and applied sciences.",
  },
  {
    name: "Sargodha",
    slug: "sargodha",
    tagline: "Central Punjab's university city",
    description:
      "Sargodha is the main higher education centre for central Punjab, led by the University of Sargodha along with medical and technical institutions.",
  },
  {
    name: "Bahawalpur",
    slug: "bahawalpur",
    tagline: "Historic campuses of southern Punjab",
    description:
      "Bahawalpur has a long-established university tradition alongside newer specialist institutions in medicine, veterinary sciences and engineering.",
  },
  {
    name: "Sahiwal",
    slug: "sahiwal",
    tagline: "Central Punjab campuses",
    description:
      "Sahiwal serves central Punjab with a general university, a medical college and university sub-campuses.",
  },
  {
    name: "Dera Ghazi Khan",
    slug: "dera-ghazi-khan",
    tagline: "Western Punjab's education centre",
    description:
      "Dera Ghazi Khan is the higher education centre for western Punjab, with a general university and a medical college serving a large rural region.",
  },
  {
    name: "Rahim Yar Khan",
    slug: "rahim-yar-khan",
    tagline: "Engineering and IT in the far south",
    description:
      "Rahim Yar Khan hosts engineering, information technology and medical institutions serving the far south of Punjab.",
  },
  {
    name: "Abbottabad",
    slug: "abbottabad",
    tagline: "Hazara's campus town",
    description:
      "Abbottabad is a hill station and campus town in the Hazara region, hosting engineering, medical and science campuses.",
  },
  {
    name: "Mardan",
    slug: "mardan",
    tagline: "Northern Khyber Pakhtunkhwa",
    description:
      "Mardan is one of Khyber Pakhtunkhwa's largest cities, with a growing set of public universities and medical institutions.",
  },
  {
    name: "Swat",
    slug: "swat",
    tagline: "Malakand division campuses",
    description:
      "Swat serves the Malakand division with a general university and medical and engineering institutions.",
  },
  {
    name: "Sukkur",
    slug: "sukkur",
    tagline: "Upper Sindh's education hub",
    description:
      "Sukkur is upper Sindh's main education centre, known particularly for its business and IT university alongside medical and engineering institutions.",
  },
  {
    name: "Larkana",
    slug: "larkana",
    tagline: "Northern Sindh campuses",
    description:
      "Larkana serves northern Sindh with medical, general and technical institutions.",
  },
  {
    name: "Muzaffarabad",
    slug: "muzaffarabad",
    tagline: "Azad Jammu and Kashmir's capital",
    description:
      "Muzaffarabad is the capital of Azad Jammu and Kashmir and hosts the region's principal university and medical college.",
  },
];
