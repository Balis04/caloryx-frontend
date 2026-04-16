import { NoticeCard } from "@/components/caloriex";

interface CoachProfileStatusNoticesProps {
  errorMessage: string | null;
  statusMessage: string | null;
}

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
