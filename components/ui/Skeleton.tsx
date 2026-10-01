import { Container } from "@/components/ui/Container";

/**
 * Loading placeholders.
 *
 * A grey outline of the page that appears instantly beats a blank screen or a
 * spinner: people read the shape and understand what is coming, so the wait
 * feels shorter even when it is not.
 *
 * Next.js renders these from a loading.tsx file while a page's data loads.
 */

function Block({ className = "" }: { className?: string }) {
  return <div className={`skeleton rounded-lg ${className}`} />;
}

/** Grey stand-in for a grid of cards. */
export function CardGridSkeleton({ count = 6 }: { count?: number }) {
  return (
    <ul className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
      {Array.from({ length: count }).map((_, index) => (
        <li
          key={index}
          className="overflow-hidden rounded-2xl border border-ink-900/10 bg-white"
        >
          <Block className="h-28 w-full rounded-none sm:h-32" />
          <div className="space-y-3 p-4">
            <Block className="h-4 w-3/4" />
            <Block className="h-3 w-1/2" />
            <Block className="h-6 w-28 rounded-full" />
          </div>
        </li>
      ))}
    </ul>
  );
}

/** Grey stand-in for the dark hero at the top of a page. */
export function HeroSkeleton() {
  return (
    <section className="bg-slate-900">
      <Container className="py-10 sm:py-14">
        <div className="h-3 w-40 rounded bg-white/10" />
        <div className="mt-4 h-9 w-2/3 rounded bg-white/10" />
        <div className="mt-4 h-5 w-full max-w-2xl rounded bg-white/10" />
        <div className="mt-2 h-5 w-4/5 max-w-xl rounded bg-white/10" />
      </Container>
    </section>
  );
}

/** Grey stand-in for a whole university page. */
export function UniversityPageSkeleton() {
  return (
    <>
      <HeroSkeleton />
      <Container className="py-10">
        <Block className="h-6 w-56" />
        <Block className="mt-4 h-28 w-full rounded-2xl" />
        <Block className="mt-8 h-6 w-64" />
        <Block className="mt-4 h-64 w-full max-w-md rounded-2xl" />
        <Block className="mt-8 h-6 w-48" />
        <Block className="mt-4 h-80 w-full rounded-2xl" />
      </Container>
    </>
  );
}
