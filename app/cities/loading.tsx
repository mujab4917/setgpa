import { Container } from "@/components/ui/Container";
import { CardGridSkeleton, HeroSkeleton } from "@/components/ui/Skeleton";

/** Shown while /cities loads its data. */
export default function Loading() {
  return (
    <>
      <HeroSkeleton />
      <Container className="py-8 sm:py-10">
        <div className="skeleton h-12 w-full max-w-xl rounded-xl" />
        <div className="skeleton mt-4 h-4 w-24 rounded" />
        <div className="mt-4">
          <CardGridSkeleton count={6} />
        </div>
      </Container>
    </>
  );
}
