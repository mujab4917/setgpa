"use client";

import Image from "next/image";
import { useState } from "react";
import { CityArtwork } from "@/components/cities/CityArtwork";
import { photoSource, photoUrl, type PlacePhoto } from "@/data/place-photos";

export function CampusScene({ citySlug, cityName, universityName, photo }: { citySlug: string; cityName: string; universityName?: string; photo?: PlacePhoto }) {
  const [failed, setFailed] = useState(false);
  const showPhoto = photo && !failed;
  return (
    <figure className="campus-scene relative my-8 isolate overflow-hidden rounded-[1.5rem] bg-ink-900 sm:my-10 sm:rounded-[1.75rem]">
      <div className="campus-scene-art absolute inset-0 -z-20">
        <CityArtwork slug={citySlug} className="h-full w-full" />
        {showPhoto && <Image src={photoUrl(photo)} alt={photo.caption} fill sizes="(max-width: 768px) 100vw, 1152px" className="object-cover" onError={() => setFailed(true)} />}
      </div>
      <div className="absolute inset-0 -z-10 bg-gradient-to-r from-ink-900/95 via-ink-900/65 to-ink-900/10" />
      <div className="px-5 py-9 sm:px-10 sm:py-20">
        <p className="text-sm font-semibold text-marker-300">Student life in {cityName}</p>
        <h2 className="mt-3 max-w-xl text-2xl font-extrabold leading-tight text-white sm:mt-4 sm:text-5xl sm:leading-[1.05]">Studying in {cityName}?<br />Know your grade table.</h2>
        <p className="mt-3 max-w-lg text-sm leading-relaxed text-white/85 sm:mt-4">{universityName ? `Your journey at ${universityName} is more than a number. Use your results to plan what comes next.` : `Find your campus in ${cityName}, explore its grade scale, and make a plan for your next semester.`}</p>
        {universityName && <a href="#target-planner" className="mt-6 inline-flex min-h-11 items-center rounded-full bg-marker-300 px-5 py-3 text-sm font-bold text-ink-900 transition-colors hover:bg-white">Plan my target GPA ↗</a>}
      </div>
      <figcaption className="bg-ink-900/85 px-6 py-3 text-xs leading-relaxed text-white/75 sm:px-10">
        {showPhoto ? <>{photo.caption} · <a className="underline underline-offset-2" href={photoSource(photo)} target="_blank" rel="noreferrer">Photo: {photo.author}</a> · <a className="underline underline-offset-2" href={`https://creativecommons.org/licenses/by-sa/${photo.version}/`} target="_blank" rel="noreferrer">CC BY-SA {photo.version}</a> · Cropped with a dark overlay; image adaptations under the same license.</> : <>Original education-inspired illustration · {cityName}</>}
      </figcaption>
    </figure>
  );
}
