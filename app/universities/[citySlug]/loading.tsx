import { Container } from "@/components/ui/Container";
import { CardGridSkeleton, HeroSkeleton } from "@/components/ui/Skeleton";

/** Shown while a city page loads its universities. */
export default function Loading() {
  return (
    <>
      <HeroSkeleton />
      <Container className="py-10 sm:py-12">
        <CardGridSkeleton count={5} />
      </Container>
    </>
  );
}
