import { GlassCardSoft } from "@/components/caloriex";
import { CardContent } from "@/components/ui/card";

interface Props {
  label: string;
  value: string;
}

export default function RequestTextPanel({ label, value }: Props) {
  return (
    <GlassCardSoft>
      <CardContent className="p-5">
        <p className="text-xs uppercase tracking-[0.32em] text-slate-500">{label}</p>
        <p className="mt-3 text-sm leading-7 text-slate-700">{value}</p>
      </CardContent>
    </GlassCardSoft>
  );
}
