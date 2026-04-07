import { NoticeCard } from "@/components/caloriex";
import type { CoachProfileStatusNoticesProps } from "../../types/coach-profile-editor.types";

export default function CoachProfileStatusNotices({
  errorMessage,
  statusMessage,
}: CoachProfileStatusNoticesProps) {
  if (!errorMessage && !statusMessage) {
    return null;
  }

  return (
    <div className="mb-6 space-y-4">
      {errorMessage ? <NoticeCard tone="danger">{errorMessage}</NoticeCard> : null}
      {statusMessage ? <NoticeCard tone="success">{statusMessage}</NoticeCard> : null}
    </div>
  );
}
