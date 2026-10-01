export interface PlacePhoto {
  file: string;
  path: string;
  author: string;
  version: "3.0" | "4.0";
  caption: string;
}

// Curated Commons photographs. Keep campus identity and licensing with each asset.
// An unmapped campus uses clearly labelled city artwork, never another campus.
export const universityPhotos: Record<string, PlacePhoto> = {
  "islamabad/air-university": { file: "Air_University_Main_Campus,_Islamabad.jpg", path: "0/04/Air_University_Main_Campus%2C_Islamabad.jpg", author: "Atta Aslam", version: "4.0", caption: "Air University main campus, Islamabad" },
  "lahore/gcu-lahore": { file: "Main_Building,_Government_College_University,_Lahore.jpg", path: "f/f8/Main_Building%2C_Government_College_University%2C_Lahore.jpg", author: "Xona14", version: "4.0", caption: "Government College University, Lahore" },
  "islamabad/nust": { file: "Nust_h12.jpg", path: "3/3c/Nust_h12.jpg", author: "Saarahmmad", version: "4.0", caption: "NUST H-12 campus, Islamabad" },
  "islamabad/quaid-i-azam-university": { file: "Quaid-i-Azam_University_Library.JPG", path: "2/29/Quaid-i-Azam_University_Library.JPG", author: "Khalid Mahmood", version: "3.0", caption: "Quaid-i-Azam University library, Islamabad" },
  "islamabad/fast-nuces": { file: "FAST_Islamabad.jpg", path: "1/10/FAST_Islamabad.jpg", author: "Pakieditor", version: "4.0", caption: "FAST-NUCES campus, Islamabad" },
  "lahore/fast-nuces": { file: "Fast_university_Lahore_campus.jpg", path: "5/55/Fast_university_Lahore_campus.jpg", author: "Zackizuki", version: "4.0", caption: "FAST-NUCES campus, Lahore" },
};

export const cityPhotos: Record<string, PlacePhoto> = {
  lahore: { file: "Badshahi_Mosque,_Lahore,_Punjab,_Pakistan.jpg", path: "5/50/Badshahi_Mosque%2C_Lahore%2C_Punjab%2C_Pakistan.jpg", author: "AnoshNadeemButt", version: "4.0", caption: "Badshahi Mosque, Lahore" },
  islamabad: { file: "The_Shah_Faisal_Mosque,_Islamabad.jpg", path: "f/f8/The_Shah_Faisal_Mosque%2C_Islamabad.jpg", author: "Mansoor Bashir", version: "4.0", caption: "Faisal Mosque, Islamabad" },
};

export function photoUrl(photo: PlacePhoto) {
  return `https://upload.wikimedia.org/wikipedia/commons/${photo.path}`;
}
export function photoSource(photo: PlacePhoto) {
  return `https://commons.wikimedia.org/wiki/File:${encodeURIComponent(photo.file)}`;
}

/**
 * Universities that have a real curated campus photo, in the order
 * `universityPhotos` lists them. Used to build the homepage showcase carousel
 * without ever inventing a stock photo for a campus that does not have one.
 */
export function pickUniversitiesWithPhotos<
  T extends { citySlug: string; slug: string; name: string; cityName: string },
>(universities: T[]): Array<T & { photo: PlacePhoto }> {
  const bySlugKey = new Map(universities.map((university) => [`${university.citySlug}/${university.slug}`, university]));

  return Object.entries(universityPhotos)
    .map(([key, photo]) => {
      const university = bySlugKey.get(key);
      return university ? { ...university, photo } : null;
    })
    .filter((entry): entry is T & { photo: PlacePhoto } => entry !== null);
}
