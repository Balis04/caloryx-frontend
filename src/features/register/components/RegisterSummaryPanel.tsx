import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import type { RegisterFormData } from "../types/register.types";

interface Props {
  values: RegisterFormData;
  roleLabel: string;
}

export function RegisterSummaryPanel({ values, roleLabel }: Props) {
  return (
    <Card className="shadow-sm">
      <CardHeader>
        <CardTitle className="text-lg">Summary</CardTitle>
      </CardHeader>
      <CardContent className="space-y-3 text-sm">
        <SummaryRow label="Full name" value={values.fullName || "-"} />
        <SummaryRow label="Birth date" value={values.birthDate || "-"} />
        <SummaryRow label="Role" value={roleLabel} />
        <Separator />
        <SummaryRow label="Height" value={values.heightCm ? `${values.heightCm} cm` : "-"} />
        <SummaryRow
          label="Starting weight"
          value={values.startWeightKg ? `${values.startWeightKg} kg` : "-"}
        />
        <Separator />
        <SummaryRow label="Goal" value={values.goal ?? "-"} />
        <SummaryRow
          label="Target weight"
          value={values.targetWeightKg ? `${values.targetWeightKg} kg` : "-"}
        />
      </CardContent>
    </Card>
  );
}

function SummaryRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-start justify-between gap-4">
      <span className="text-muted-foreground">{label}</span>
      <span className="text-right font-medium">{value}</span>
    </div>
  );
}
