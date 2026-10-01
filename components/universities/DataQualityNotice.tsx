import { universityPageContent } from "@/data/site-content";
import { WhatsAppContact } from "@/components/feedback/WhatsAppContact";
import { universityFeedbackMessage } from "@/lib/whatsapp";

/**
 * Short note about the grading data, shown at the BOTTOM of a university page.
 *
 * Deliberately small and calm. A large warning at the top of every page made
 * the whole site look unreliable before a student had read a single number.
 * This says the same thing in one line, in the place where someone who has
 * just used the calculator will see it, and gives them a way to report a
 * mistake.
 *
 * When a university has been checked against its official handbook, set
 * isVerified = true and fill in sourceNote; the note then names that source
 * instead.
 */
export function DataQualityNotice({
  isVerified,
  sourceNote,
  universityName,
  cityName,
}: {
  isVerified: boolean;
  sourceNote: string | null;
  universityName: string;
  cityName: string;
}) {
  return (
    <aside className="mt-10 rounded-xl border border-ink-900/10 bg-cream-100 px-4 py-3.5 text-xs leading-relaxed text-ink-700">
      {isVerified && sourceNote ? (
        <>
          <span className="font-semibold text-ink-700">
            {universityPageContent.verifiedNoticePrefix}{" "}
          </span>
          {sourceNote}{" "}
        </>
      ) : (
        <>{universityPageContent.dataNotice} </>
      )}
      <WhatsAppContact
        variant="link"
        className="text-xs"
        message={universityFeedbackMessage(universityName, cityName)}
      />
    </aside>
  );
}
