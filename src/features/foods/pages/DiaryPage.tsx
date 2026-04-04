import DiaryWorkspace from "../components/diary/DiaryWorkspace";
import { useDiaryPage } from "../hooks/diary/useDiaryPage";

export default function DiaryPage() {
  const diary = useDiaryPage();

  return <DiaryWorkspace diary={diary} />;
}
