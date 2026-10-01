"use client";

import { useEffect } from "react";

import { Container } from "@/components/ui/Container";
import { errorContent } from "@/data/site-content";

/**
 * Error boundary for the whole app.
 *
 * If the database is unreachable or a query fails, the student sees this
 * friendly page. The real error object stays on the server - it is logged
 * there and never printed on screen, so no connection details leak.
 */
export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    // Shows up in your terminal / hosting logs, not in the browser UI.
    console.error("Page failed to render:", error.digest ?? error.message);
  }, [error]);

  return (
    <Container className="py-16">
      <h1 className="text-3xl font-bold text-ink-900">
        {errorContent.genericErrorTitle}
      </h1>
      <p className="mt-3 max-w-xl leading-relaxed text-ink-700">
        {errorContent.genericErrorBody}
      </p>
      <button
        type="button"
        onClick={reset}
        className="mt-6 inline-flex items-center justify-center rounded-lg bg-brand-600 px-5 py-2.5 text-sm font-semibold text-white hover:bg-brand-700"
      >
        {errorContent.retryLabel}
      </button>
    </Container>
  );
}
